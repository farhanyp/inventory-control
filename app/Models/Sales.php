<?php

namespace App\Models;

use App\Enums\PaymentMethodType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sales extends Model
{
    use HasFactory;

    protected $table = 'sales';

    const UPDATED_AT = null;

    protected $fillable = [
        'transaction_number',
        'transaction_date',
        'reseller_id',
        'payment_method',
        'total',
        'paid_amount',
        'change_amount',
        'description',
        'created_by',
    ];

    public function reseller()
    {
        return $this->belongsTo(Reseller::class, 'reseller_id');
    }

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'payment_method' => PaymentMethodType::class,
            'total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'change_amount' => 'decimal:2',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function details(): HasMany
    {
        return $this->hasMany(SalesDetail::class, 'sales_id');
    }
}
