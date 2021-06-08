var expect = require('chai').expect;
var sinon = require('sinon');

var moduleLoader = require('./common/moduleLoader.js');
var mockFactory = require('./common/mockFactory.js');
var json = require('./common/jsonComparer.js');

var js = './transformer.js';

describe('feature: Test final request path', function() {

    it('should be api/families.ashx', function(done) {

        var mock = mockFactory.getMock();

        mock.contextGetVariableMethod.withArgs('flow.target.basepath').returns('api');
        mock.contextGetVariableMethod.withArgs('proxy.pathsuffix').returns('families');

        moduleLoader.load(js, function(err) {

            expect(err).to.be.undefined;

            expect(mock.contextSetVariableMethod.calledWith('flow.target.basepath','api/families.ashx')).to.be.true;
            expect(mock.contextSetVariableMethod.calledWith('target.copy.pathsuffix', false)).to.be.true;

            done();
        });
    });
});


var transformer = require('./transformer.js');

var source = {
    "pointsInfo": {
        "pointsQty": 0,
        "ivaTax": 0
    },
    "creditCardInfo": {
        "creditCardId": "string",
        "amount": 0,
        "installments": 0,
        "ivaTax": null,
        "comsumptionTax": 0,
        "taxBase": 0,
        "tip": 0,
        "locationInfo":{
            "terminalId": "1",
            "storeCode": "1",
            "storeName": "1",
            "countryCode": "1",
            "stateCode": "1",
            "cityCode": "1",
            "cityName": "1"
        },
        index: [
            0,1,2,3,4,5
        ]
    },
    index: [
        0,1,2,3
    ],
    complexArray: [
        {
            'firstName': 'Isaias',
            'lastName': 'Arellano'
        },
        {
            'firstName': 'Melissa',
            'lastName': 'Martin'
        }
    ]
};


var spec = {
    type: 'object',
    additionalAttributes: {
        'a': 'c'
    },
    attributes: {
        index: {
            type: 'array',
            required: true,
            source: 'index',
            itemName: 'ItemName'
        },
        InfoPuntos: {
            source: "pointsInfo",
            type: "object",
            attributes: {
                numCantidadPuntos: "pointsQty",
                numImpuestosIVA: "ivaTax"
            }
        },
        InfoTarjetaCredito: {
            source: "creditCardInfo",
            type: "object",
            attributes: {
                index: {
                    type: 'array',
                    required: true,
                    source: 'index'
                },
                numTarjetaCredito: {
                    type: "string",
                    source: "creditCardId"
                },
                valValorAPagar: {
                    type: "number",
                    source: "amount"
                },
                numCuotas: {
                    type: "int",
                    source: "installments"
                },
                numImpuestosIVA: {
                    type: "number",
                    source: "ivaTax",
                    required: false,
                    nullable: true
                },
                numImpuestosConsumo: {
                    type: "float",
                    source: "comsumptionTax"
                },
                numImpuestosBaseDev: {
                    type: "float",
                    source: "taxBase"
                },
                numPropinaOblig: {
                    type: "float",
                    source: "tip",
                    required: false
                },
                UbicacionCompraInfo: {
                    type: "object",
                    required: false,
                    source: "locationInfo",
                    before: (source, spec, target, attribute) => {
                    },
                    after: (source, spec, target, attribute) => {
                    },
                    additionalAttributes: {
                        t: 'c'
                    },
                    attributes: {
                        numNumeroTerminal: "terminalId",
                        valCodigoComercio: "storeCode",
                        valNombreComercio: "storeName",
                        valCodigoPais: "countryCode",
                        valCodigoDepartamento: "stateCode",
                        valCodigoCiudad: "cityCode",
                        valNombreCiudad: "cityName"
                    }
                }
            }
        },
        ComplexArray: {
            source: 'complexArray',
            itemName: 'Individual',
            itemCallback: (source, spec, target, itemValue, i) => {
                itemValue.FirstName = itemValue.FirstName + ' - ' + i;
                // target[i] = itemValue.FirstName + ' - ' + i;
            },
            before: () => { console.log("Desde aca") },
            items: {
                FirstName: {
                    source: "firstName",
                    required: true
                },
                LastName: {
                    source: "lastName"
                }
            }
        }
    }
};

var options = {
    defaultMissing: null,
    allowNulls: false,
    defaultRequired: false,
    enforceTypes: true
};

var data = transformer.transform(source, spec, options);

console.log(JSON.stringify(data, null, 4));