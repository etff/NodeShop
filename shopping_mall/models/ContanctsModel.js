var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

var ContactsSchema = new ContactsSchema({
    name        : String,   // 이름
    phone       : String,   // 전화번호부. 
    email       : String,   // 이메일
    created_at  : { //작성일
        type    :   Date,    
        default :   Date.now()
    }
});

ContactsSchema.virtual('getDate').get(function() {
    var date = new Date(this.created_at);

    return {
        year    : date.getFullYear,
        month   : date.getMonth()+1,
        day     : date.getDate()   
    }
});


// 1씩 증가하는 primary key를 만든다.
// Model : 생성할 document 이름
// field : Primary key, startAt : 1

ContactsSchema.plugin(autoincrement, { model: 'contacts', field : 'id', startAt : 1 });
model.exports = mongoose.model('contacts', ContactsSchema);