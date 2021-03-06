
// Transaction
//
// explicit representation of db and transaction
// 

// usage:
//     
//     container.connect();
//     
//     // getting transaction object does not start transaction, you should do it by yourself
//     var transaction = container.getTransaction();
//     
//     // begin transaction
//     transaction.begin();
//     
//     // set isolation level after begin()
//     transaction.isolationLebelSerializable();
//     transaction.isolationLevel(transaction.ISOLATION_LEVEL.SERIALIZABLE);
//     
//     // commit will abort if there is no commit request from model
//     transaction.commit();
//     
//     // rollback will abort if there is no commit request from model
//     transaction.rollback();
//     
//     // abort transaction
//     transaction.abort();
//     
//     container.disconnect();
//     
//     

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function TransactionConstructor(){
	// instance variables
	this.container    = arguments[0];
	this.db_client    = arguments[1];
	this.cache_client = arguments[2];
}

module.exports = TransactionConstructor;

var Transaction = TransactionConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// static variables

var AUTOCOMMIT                     = 1;
var ISOLATIONLEVEL_SERIALIZABLE    = 2;
var ISOLATIONLEVEL_REPEATABLE_READ = 3;
var ISOLATIONLEVEL_READ_COMMITED   = 4;

Transaction.AUTOCOMMIT = AUTOCOMMIT;

Transaction.ISOLATION_LEVEL = {
	SERIALIZABLE    : ISOLATIONLEVEL_SERIALIZABLE,
	REPEATABLE_READ : ISOLATIONLEVEL_REPEATABLE_READ,
	READ_COMMITED   : ISOLATIONLEVEL_READ_COMMITED
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

Transaction.begin = function(){
	this.db_client.begin();
};

Transaction.setAutoCommit = function(){
	this.db_client.setAutoCommit();
};

Transaction.isolationLevel = function(level){
	if( level == ISOLATIONLEVEL_SERIALIZABLE ){
		this.isolationLebelSerializable();
	}
	else if( level == ISOLATIONLEVEL_REPEATABLE_READ ){
		this.isolationLebelRepeatableRead();
	}
	else if( level == ISOLATIONLEVEL_READ_COMMITED ){
		this.isolationLebelReadCommited();
	}else{
		this.isolationLebelSerializable();
	}
};

Transaction.isolationLebelSerializable = function(){
	this.db_client.setIsolationLebelSerializable();
};

Transaction.isolationLebelRepeatableRead = function(){
	this.db_client.setIsolationLebelRepeatableRead();
};

Transaction.isolationLebelReadCommited = function(){
	this.db_client.setIsolationLebelReadCommited();
};

Transaction.forceCommit = function(){
	this.db_client.commit();
};

Transaction.commit = function(){
	if( this.container.shouldCommit ){
		this.db_client.commit();
	}else{
		this.db_client.abort();
	}
};

Transaction.forceRollback = function(){
	this.db_client.rollback();
};

Transaction.rollback = function(){
	if( this.container.shouldCommit ){
		this.db_client.rollback();
	}else{
		this.db_client.abort();
	}
};

Transaction.abort = function(){
	this.db_client.abort();
};

Transaction.close = function(){
	this.abort();
};


