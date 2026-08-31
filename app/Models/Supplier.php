<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'supplier';

    const UPDATED_AT = null;

    protected $fillable = [
        'supplier_code',
        'supplier_name',
        'phone_number',
        'address',
    ];

    public function incomingProducts(): HasMany
    {
        return $this->hasMany(IncomingProduct::class, 'supplier_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->supplier_code)) {
                $latest = self::latest('id')->first();
                $nextId = $latest ? $latest->id + 1 : 1;
                $model->supplier_code = 'SUP-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
            }
        });
    }
}
