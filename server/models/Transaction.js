var mongoose = require('mongoose');

var transactionInfoSchema = mongoose.Schema({
	itemId: String,
	amount: Number,
	type: String }, { _id: false });

var transactionSchema = mongoose.Schema({    
    itemsTransactionData: [TransactionInfo],
	state: String,
	lastModified: Date
});

var TransactionInfo = mongoose.model('TransactionInfo', transactionInfoSchema);
var Transaction = mongoose.model('Transaction', transactionSchema);