/**
 * Captura os dados de uma página específica da planilha e roda a função especificada no parâmetro Dados.
 * @param {Object} Dados Objeto com o ID da planilha, nome da página e função para a utilização dos dados. 
 */
const getSheetData = ({ sheetID, sheetName, callback }) => {
    gapi.client.load('sheets', 'v4', function () {
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: sheetID,
            ranges: sheetName,
            includeGridData: true
        }).then((response) => {
            var rowData = response.result.sheets[0].data[0].rowData;
            callback(responseToObjects(rowData));
        }, (error) => {
            console.error('Erro ao utilizar dados da planilha:', error);
            if (error.status === 403) {
                console.log('Usuário não tem permissão para acessar o arquivo. Redirecionando...');
                handleSignoutClick(false);
                location.assign("https://colegiosatelite.com.br/agendamento/acessonegado");
            }
        });
    });

    function responseToObjects(res) {
        let data = [];
        let rowObject;
        let cellData;
        let propName;

        let labels = res[0]["values"];

        for (let r = 1, rowMax = res.length; r < rowMax; r++) {
            rowObject = {};
            for (let c = 0, colMax = labels.length; c < colMax; c++) {
                propName = labels[c]["formattedValue"];
                cellData = res[r]["values"][c]["formattedValue"];
                if (cellData === null) {
                    rowObject[propName] = "";
                } else if (typeof cellData == "string" && cellData.startsWith("Date")) {
                    rowObject[propName] = new Date(cellData);
                } else if (!isNaN(Number(cellData)) && cellData !== null) {
                    rowObject[propName] = Number(cellData)
                } else {
                    rowObject[propName] = cellData;
                }
            }
            data.push(rowObject);
        }
        return data;
    }
};

/**
 * Callback para utilizar os dados da planilha
 * @callback sheetDataCallback
 * @param {Object[]} sheetData
 */

/**
 * Implementação de {@link getSheetData} para utilizar os dados de uma página especificada da planilha
 * @param {string} sheetName Título da página da planilha
 * @param {sheetDataCallback} sheetDataCallback Callback que utiliza os dados da planilha
 */
function getSheetDataCallback(sheetName, sheetDataCallback) {
    var promise = new Promise((res, rej) => {
        try {
            const sheetDataHandler = async (sheetData) => {
                await sheetDataCallback(sheetData);
                res();
            }

            getSheetData({
                sheetID: '1CJybEPi2DvzoqQjYFjCcbi8AyQlptxlT0uV9aTggFbk',
                sheetName: sheetName,
                callback: sheetDataHandler,
            });
        } catch (err) {
            rej();
        }
    });

    return promise;
}