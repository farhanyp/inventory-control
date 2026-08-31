<?php

namespace App\Enums;

enum PaymentMethodType: string
{
    case CASH = 'Cash';
    case TRANSFER = 'Transfer';
}
