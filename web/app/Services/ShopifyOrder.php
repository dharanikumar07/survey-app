<?php

namespace App\Services;

class ShopifyOrder
{
    public $id;
    public $name;

    public function __construct($orderData)
    {
        $this->id = $orderData['id'] ?? '';
        $this->name = $orderData['confirmation_number'] ?? '';
    }

    public function getOrderId()
    {
        return $this->id;
    }

    public function getOrderName()
    {
        return $this->name;
    }
}
