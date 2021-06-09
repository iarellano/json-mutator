'use strict';

var spec = {
    desc: "Complex bbject",
    type: 'object',
    additionalAttributes: {
        'a': 'c'
    },
    attributes: {
        index: {
            type: 'array',
            required: true,
            source: 'index',
            itemName: 'ItemName',
            items: {
                type: "int"
            }
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
                    source: 'index',
                    items: {
                        type: "int"
                    }
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
            before: () => { },
            items: {
                type: "object",
                attributes: {
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
    }
};

exports.spec = spec;