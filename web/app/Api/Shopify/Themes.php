<?php

namespace App\Api\Shopify;

use App\Api\Shopify\Traits\ShopifyHelper;

class Themes
{
    use ShopifyHelper;

    /**
     * Get theme data with specific files (following reference implementation)
     */
    public function getThemeData(array $filenames = ['config/settings_data.json']): array
    {
        $params = [
            'roles' => ['MAIN'],
            'filenames' => $filenames
        ];
        
        $request_params = $this->getListQuery($params);
        $response = $this->sendRequest($request_params);
        
        if (empty($response)) {
            return [];
        }
        
        return $response['data']['themes']['nodes'][0] ?? [];
    }

    /**
     * Build GraphQL query for theme data (following reference implementation)
     */
    protected function getListQuery($params)
    {
        return [
            'query' => <<<QUERY
query ThemeList(\$roles: [ThemeRole!], \$filenames: [String!]!) {
  themes(first: 10, roles: \$roles) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      id
      name
      files(filenames: \$filenames) {
        nodes {
          body {
            ... on OnlineStoreThemeFileBodyBase64 {
              __typename
              contentBase64
            }
            ... on OnlineStoreThemeFileBodyText {
              __typename
              content
            }
            ... on OnlineStoreThemeFileBodyUrl {
              __typename
              url
            }
          }
          filename
        }
      }
      role
    }
  }
}
QUERY,
            'variables' => $params
        ];
    }

    /**
     * Check if extension is enabled in theme
     * Always returns deeplink for consistent UX (users can reconfigure even if enabled)
     */
    public function checkExtensionStatus(string $extensionBlock): array
    {
        $theme = $this->getThemeData();
        $deepLink = $this->generateExtensionDeepLink($extensionBlock);
        
        if (empty($theme['files']['nodes'])) {
            return [
                'enabled' => false,
                'deep_link' => $deepLink
            ];
        }

        foreach ($theme['files']['nodes'] as $file) {
            if ($file['filename'] === 'config/settings_data.json') {
                $content = $file['body']['content'] ?? '';
                $settings = $this->extractAndParseJSON($content);
                $extensionBlockData = $this->extractExtension($settings, $extensionBlock);
                
                return [
                    'enabled' => $extensionBlockData ? !($extensionBlockData['disabled'] ?? false) : false,
                    'deep_link' => $deepLink
                ];
            }
        }

        return [
            'enabled' => false,
            'deep_link' => $deepLink
        ];
    }

    /**
     * Generate extension activation deeplink
     */
    public function generateExtensionDeepLink(string $extensionBlock): string
    {
        // Extract domain from store URL more reliably
        $domain = $this->extractDomain($this->storeUrl);
        $appApiKey = config('shopify.api_key');
        
        return "https://{$domain}/admin/themes/current/editor?context=apps&template=index&activateAppId={$appApiKey}/{$extensionBlock}";
    }

    /**
     * Extract domain from store URL
     */
    private function extractDomain(string $storeUrl): string
    {
        // Remove protocol if present
        $url = preg_replace('/^https?:\/\//', '', $storeUrl);
        
        // Remove any path after domain
        $domain = strtok($url, '/');
        
        // Ensure it's a valid Shopify domain
        if (strpos($domain, '.myshopify.com') === false) {
            // If it's not a full domain, assume it's just the shop name
            $domain = $domain . '.myshopify.com';
        }
        
        return $domain;
    }

    /**
     * Extract and parse JSON from theme file content
     */
    private function extractAndParseJSON(?string $content): array
    {
        if (empty($content)) {
            return [];
        }

        $jsonStart = strpos($content, '{');
        if ($jsonStart === false) {
            return [];
        }

        $jsonString = substr($content, $jsonStart);
        return json_decode($jsonString, true) ?? [];
    }

    /**
     * Extract app handle from config
     */
    private function extractAppHandle(string $storeUrl): string
    {
        return config('shopify.app_handle', 'testing-app-1025');
    }

    /**
     * Extract extension block from theme settings (following reference implementation)
     */
    private function extractExtension(array $data, string $extensionBlock): ?array
    {
        try {
            $blocks = $data['current']['blocks'] ?? [];
            
            if ($blocks) {
                $blockName = config('shopify.api_key') . "/blocks/{$extensionBlock}";
                
                // Try to extract app handle from store URL or use fallback
                $appHandle = $this->extractAppHandle($this->storeUrl);
                $fullBlockName = "shopify://apps/{$appHandle}/blocks/{$extensionBlock}";
                
                foreach ($blocks as $block) {
                    $blockType = $block['type'] ?? 'no_type';
                    $containsSimple = strpos($blockType, $blockName) !== false;
                    $containsFull = strpos($blockType, $fullBlockName) !== false;
                    $containsExtensionBlock = strpos($blockType, "/blocks/{$extensionBlock}") !== false;
                    
                    // Check multiple patterns to match the block
                    if ($containsSimple || $containsFull || $containsExtensionBlock) {
                        return $block;
                    }
                }
            }
            
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
