<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BatchStock extends Model
{
    use HasFactory;

    protected $table = 'batch_stock';

    const UPDATED_AT = null;

    protected $fillable = [
        'product_id',
        'batch_no',
        'expired_date',
        'initial_quantity',
        'remaining_quantity',
        'purchase_price',
        'incoming_source_id',
    ];

    protected $appends = ['expired_status'];

    public function getExpiredStatusAttribute()
    {
        if (empty($this->expired_date)) {
            return 'Aman';
        }

        $today = \Carbon\Carbon::today();
        $expired = \Carbon\Carbon::parse($this->expired_date)->startOfDay();

        if ($expired->isPast()) {
            return 'Expired';
        }

        $diff = $today->diffInDays($expired, false);

        if ($diff <= 30) {
            return 'Hampir Expired';
        }

        return 'Aman';
    }

    protected function casts(): array
    {
        return [
            'expired_date' => 'date',
            'initial_quantity' => 'decimal:2',
            'remaining_quantity' => 'decimal:2',
            'purchase_price' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function incomingProduct(): BelongsTo
    {
        return $this->belongsTo(IncomingProduct::class, 'incoming_source_id');
    }

    public function salesDetails(): HasMany
    {
        return $this->hasMany(SalesDetail::class, 'batch_id');
    }

    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class, 'batch_id');
    }
}
