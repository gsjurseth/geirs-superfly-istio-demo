var first = context.getVariable('response.content');
var pFirst = JSON.parse(first);

//var second = context.getVariable('priceResponse.content');
var third = context.getVariable('warehouseResponse.content');
var pSecond = JSON.parse(second);
var pThird = JSON.parse(third);

var newHash = {};

for ( var i in pFirst) {
    var name = pFirst[i].name;
    print('working on name: ', name);
    newHash[ name ] = { 'imgUrl': pFirst[i].imgUrl };
}

/*
for ( var i in pSecond) {
    newHash[ pSecond[i].name ].price = pSecond[i].price;
}
*/

for ( var i in pThird) {
    newHash[ pThird[i].name ].amount = pThird[i].number;
}

context.setVariable('newResponse',JSON.stringify(newHash));
