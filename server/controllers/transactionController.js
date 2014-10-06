var Transaction = require('mongoose').model('Transaction'),
	itemsTypesIndexes = require('../data/itemsTypesIndexes'),
	Item = require('mongoose').model('Item'),
	Q = require('q');

rollbackTransactions(Q.defer());

module.exports = {
	beginTransaction: function(data) {
		var defer = Q.defer(),
			transactionDefer = Q.defer();

		initialize(data, transactionDefer);
		transactionDefer.promise.then(function() {
			defer.resolve({
				result: data
			});
		}, function(data) {
			var reason = "Out of stock!"
			if(data.err && data.err.message) {
				reason = data.err.message;
			}
			defer.reject({
				reason: reason
			});
			if (data.transaction) {
				rollbackTransaction(data.transaction, Q.defer());
			}
		});
		return defer.promise;
	}
}

function initialize(data, defer) {
	Transaction.create({
		itemsTransactionData: data,
		state: "initial",
		lastModified: new Date()
	}, function(err, t) {
		if (err) {
			return defer.reject({
				state: "initialize",
				err: err,
				transaction: t
			});
		}

		startTransaction(t, defer);
	});
}

function startTransaction(t, defer) {
	Transaction.findOne({
		_id: t.id,
		state: "initial"
	}, function(err, t) {
		if (err) {
			return defer.reject({
				state: "startTransaction",
				err: err,
				transaction: t
			})
		}

		pendingTransaction(t, defer)
	});
}

function pendingTransaction(t, defer) {
	Transaction.update({
		_id: t.id,
		state: "initial"
	}, {
		$set: {
			state: "pending"
		},
		$currentDate: {
			lastModified: true
		}
	}, function(err, count) {
		if (err) {
			return defer.reject({
				state: "pendingTransaction",
				err: err,
				transaction: t
			})
		}

		applyTransactionData(t, defer);
	})
}

function applyTransactionData(t, defer) {
	var itemsUpdated = 0,
		data = t.itemsTransactionData;

	for (var i = 0; i < data.length; i++) {
		var queryParams = getQueryParams(data[i], "dec");
		queryParams.findParams['_id'] = data[i][0]._id;
		queryParams.findParams['pendingTransactions'] = { $ne: t.id };

		Item.update(queryParams.findParams, {
			$inc: queryParams.updateParams,
			$push: {
				pendingTransactions: t.id
			}
		}, function(err, count) {
			if (err || count === 0) {
				var errObj = err;
				if(count === 0) {
					errObj = { message: "Item ordered not in stock!" };
				}
				return defer.reject({
					state: "applyTransactionData",
					err: errObj,
					transaction: t
				});
			}

			itemsUpdated++;
			if (itemsUpdated === data.length) {
				appliedTransaction(t, defer);
			}
		})
	}
}

function appliedTransaction(t, defer) {
	Transaction.update({
		_id: t.id,
		state: "pending"
	}, {
		$set: {
			state: "applied"
		},
		$currentDate: {
			lastModified: true
		}
	}, function(err, count) {
		if (err) {
			return defer.reject({
				state: "appliedTransaction",
				err: err,
				transaction: t
			});
		}

		removeTransactionDataPending(t, defer);
	})
}

function removeTransactionDataPending(t, defer) {
	var transactionData = t.itemsTransactionData,
		itemsUpdated = 0;

	for (var i = 0; i < transactionData.length; i++) {
		Item.update({
			_id: transactionData[i]._id,
			pendingTransactions: t.id
		}, {
			$pull: {
				pendingTransactions: t.id
			}
		}, function(err, count) {
			if (err) {
				return defer.reject({
					state: "removeTransactionDataPending",
					err: err,
					transaction: t
				});
			}

			itemsUpdated++;
			if (itemsUpdated === transactionData.length) {
				doneTransaction(t, defer);
			}
		})
	}
}

function doneTransaction(t, defer) {
	Transaction.update({
		_id: t.id,
		state: "applied"
	}, {
		$set: {
			state: "done"
		},
		$currentDate: {
			lastModified: true
		}
	}, function(err, count) {
		if (err) {
			return defer.reject({
				state: "doneTransaction",
				err: err,
				transaction: t
			});
		}

		defer.resolve();
	})
}

function rollbackTransactions(defer) {
	Transaction.find({
		state: "pending"
	}, function(err, collection) {
		if (err) {
			return defer.reject({
				state: "rollbackTransactions",
				err: err
			});
		}

		if (collection) {
			collection.forEach(function(transaction) {
				rollbackTransaction(transaction, Q.defer());
			})
		}
	})
}

function rollbackTransaction(t, defer) {
	Transaction.update({
		_id: t.id,
		state: "pending"
	}, {
		$set: {
			state: "canceling"
		},
		$currentDate: {
			lastModified: true
		}
	}, function(err, count) {
		if (err) {
			return defer.reject({
				state: "rollbackTransaction",
				err: err,
				transaction: t
			});
		}

		undoTransactionData(t, defer);
	})
}

function undoTransactionData(t, defer) {
	var itemsUpdated = 0,
		data = t.itemsTransactionData;

	for (var i = 0; i < data.length; i++) {
		var queryParams = getQueryParams(data[i], "inc"),
			findParams = {};

		findParams['_id'] = data[i][0]._id;
		findParams['pendingTransactions'] = t.id ;

		Item.update(findParams, {
			$inc: queryParams.updateParams,
			$pull: {
				pendingTransactions: t.id
			}
		}, function(err, count) {
			if (err) {
				return defer.reject({
					state: "undoTransactionData",
					err: err,
					transaction: t
				});
			}

			itemsUpdated++;
			if (itemsUpdated === t.itemsTransactionData.length) {
				canceledTransaction(t, defer);
			}
		})
	}
}

function canceledTransaction(t, defer) {
	Transaction.update({
		_id: t.id,
		state: "canceling"
	}, {
		$set: {
			state: "cancelled"
		},
		$currentDate: {
			lastModified: true
		}
	}, function(err, count) {
		if (err) {
			return defer.reject({
				state: "canceledTransaction",
				err: err,
				transaction: t
			});
		}

		defer.resolve();
	})
}

function getQueryParams(item, operation) {
	var findParams = {},
		updateParams = {};
	for(var i = 0; i < item.length; i++) {
		var itemType = item[i].type,
			key = 'inStock.' + itemsTypesIndexes[itemType] + "." +  itemType,
			amount = item[i].amount;
		updateParams[key] = (operation === "dec" ? -amount : amount);
		findParams[key] = { $gte: amount };
	}
	return {
		updateParams: updateParams,
		findParams: findParams
	};
}