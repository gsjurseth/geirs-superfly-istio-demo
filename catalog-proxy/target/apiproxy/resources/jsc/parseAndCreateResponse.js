var first = context.getVariable('response.content');
var pFirst = JSON.parse(first);

var second = context.getVariable('priceResponse.content');
var third = context.getVariable('warehouseResponse.content');
var pSecond = JSON.parse(second);
var pThird = JSON.parse(third);

var newHash = {};

for ( var i in pFirst) {
    var id = pFirst[i]._id;
    print('working on name: ', pFirst[i].name);
    newHash[ id ] = { 'imgUrl': pFirst[i].imgUrl,
      'desc': pFirst[i].desc,
      'name': pFirst[i].name,
      'id': id
    };
}

for ( var i in pSecond) {
    newHash[ pSecond[i]._id ].price = pSecond[i].price;
}

for ( var i in pThird) {
    newHash[ pThird[i]._id ].amount = pThird[i].number;
}

context.setVariable('newResponse',JSON.stringify(newHash));
