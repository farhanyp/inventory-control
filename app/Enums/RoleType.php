<?php

namespace App\Enums;

enum RoleType: string
{
    case ADMIN = 'ADMIN'; //admin
    case STAFF = 'STAFF'; //staff gudang
    case MANAGEMENT = 'MANAGEMENT'; //pimpinan
}
