<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IncomingProduct extends Model
{
    use HasFactory;

    protected $table = 'incoming_product';

    const UPDATED_AT = null;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->invoice_number)) {
                $lastRecord = self::orderBy('id', 'desc')->first();
                $lastNumber = $lastRecord ? intval(substr($lastRecord->invoice_number, 4)) : 0;
                $model->invoice_number = 'INV-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            }
            if (empty($model->batch_no)) {
                $lastRecord = self::orderBy('id', 'desc')->first();
                $lastNumber = $lastRecord ? intval(substr($lastRecord->batch_no, 6)) : 0;
                $model->batch_no = 'BATCH-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    protected $fillable = [
        'incoming_date',
        'invoice_number',
        'supplier_id',
        'product_id',
        'batch_no',
        'expired_date',
        'quantity',
        'purchase_price',
        'total',
        'description',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'incoming_date' => 'date',
            'expired_date' => 'date',
            'quantity' => 'decimal:2',
            'purchase_price' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function batchStocks(): HasMany
    {
        return $this->hasMany(BatchStock::class, 'incoming_source_id');
    }
}
