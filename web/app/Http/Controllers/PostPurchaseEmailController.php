<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Models\Store;
use App\Models\Survey;
use App\Services\PostPurchaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PostPurchaseEmailController extends Controller
{
    public function savePostPurchaseEmail(Request $request)
    {
       DB::beginTransaction();
       try {
           $session = $request->get('shopifySession');
           $store   = Store::where('store_url', $session->getShop())->firstOrFail();
           $surveyUuid = $request->input('survey_uuid') ?? null;
           $emailData = $request->input('email_data');

           $survey = Survey::where('store_uuid', $store->uuid)
               ->where('uuid', $surveyUuid)
               ->firstOrFail();

           if(empty($survey)) {
               return Response::json([
                   'error' => 'Survey not found'
               ], HttpResponse::HTTP_NOT_FOUND);
           }

           $surveyMetaData = $survey->survey_meta_data ?? [];
           if(is_string($surveyMetaData)){
               $surveyMetaData = json_decode($surveyMetaData, true);
           }

           $surveyMetaData['channels']['post_purchase_email']['enabled'] = true;
           $surveyMetaData['channels']['post_purchase_email']['email_data'] = $emailData;

           $survey->survey_meta_data = $surveyMetaData;
           $survey->save();

           DB::commit();
           return Response::json([
               'message' => 'Email template saved successfully',
               'data' => [
                   'survey_uuid' => $survey->uuid,
                   'email_data' => $emailData
               ]
           ],HttpResponse::HTTP_OK);
       } catch(\Exception $e) {
           DB::rollback();
           Helper::logError('Unable to save the post purchase email', [__CLASS__, __FUNCTION__], $e, $request->toArray());
           return Response::json([
               'error' => 'An error occurred save the post purchase email',
           ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
       }
    }

    public function getPostPurchaseEmail(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $store   = Store::where('store_url', $session->getShop())->firstOrFail();

            $postPurchaseService = new PostPurchaseService();
            $data = $postPurchaseService->getPostPurchaseEmailData($store->uuid);

            return Response::json([
                'data' => $data,
            ]);
        } catch (\Exception $exception) {
            Helper::logError('Unable to get the post purchase email', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred get the post purchase email',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
