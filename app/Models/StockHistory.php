<?php

namespace App\Models;

use App\Enums\MutationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockHistory extends Model
{
    use HasFactory;

    protected $table = 'stock_history';

    const UPDATED_AT = null;

    protected $fillable = [
        'history_date',
        'product_id',
        'batch_id',
        'type',
        'ref_table',
        'ref_id',
        'incoming_quantity',
        'outgoing_quantity',
        'final_stock',
        'description',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'history_date' => 'date',
            'type' => MutationType::class,
            'incoming_quantity' => 'decimal:2',
            'outgoing_quantity' => 'decimal:2',
            'final_stock' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function batchStock(): BelongsTo
    {
        return $this->belongsTo(BatchStock::class, 'batch_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the referencing transaction (e.g. SalesDetail, IncomingProduct, etc.).
     */
    public function reference(): MorphTo
    {
        return $this->morphTo(null, 'ref_table', 'ref_id');
    }
}
