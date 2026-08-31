<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesDetail extends Model
{
    use HasFactory;

    protected $table = 'sales_detail';

    public $timestamps = false;

    protected $fillable = [
        'sales_id',
        'reseller_id',
        'product_id',
        'batch_id',
        'quantity',
        'selling_price',
        'subtotal',
        'expired_date',
        'batch_no',
    ];

    public function reseller()
    {
        return $this->belongsTo(Reseller::class, 'reseller_id');
    }

    protected function casts(): array
    {
        return [
            'expired_date' => 'date',
            'quantity' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function sales(): BelongsTo
    {
        return $this->belongsTo(Sales::class, 'sales_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function batchStock(): BelongsTo
    {
        return $this->belongsTo(BatchStock::class, 'batch_id');
    }
}
