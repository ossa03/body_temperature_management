const form = FormApp.openById('1qieEigvsY-duGK9Ju5a8DouQuWDt6KMIztqlte9Amv8')
function myFunction() {
	// Open a form by ID and log the responses to each question.
	const formResponses = form.getResponses()
	// 送信メッセージの初期化
	let sendMessage = ''

	formResponses.forEach((formResponse) => {
		const itemResponses = formResponse.getItemResponses()
		// ヘッダーの初期化
		const tableHeaders = []
		// 2行目以降のitemが全て入る配列の初期化
		const tableRows = []
		// ヘッダー以外の1行ずつのデータが昼オブジェクトの初期化
		const tableRow = {}

		// フォーム送信ごとのタイムスタンプ
		const timeStamp = formResponse.getTimestamp()
		// タイムスタンプから日にちだけ抽出 type:number
		const dateOfTimestamp = timeStamp.getDate()

		// テーブル(スプレッドシート)を1行ずつループしていく
		itemResponses.forEach((itemResponse, index) => {
			// ヘッダーを取得する
			const tableHeader = itemResponse.getItem().getTitle()
			tableHeaders.push(tableHeader)

			const item = itemResponse.getResponse()

			tableRow[tableHeaders[index]] = item
			// フォーム入力で日付を入力するのがめんどいのでタイムスタンプから自動生成することにした。
			// "日にち"を手動で追加
			tableRow['日にち'] = `${dateOfTimestamp}日`

			console.log('tableRow::', tableRow)
		})

		tableRows.push(tableRow)
		console.log('tableRows::', tableRows)

		// tableRowsはオブジェクトの配列。オブジェクトのvalueだけをsendMessageに追加していく
		tableRows.forEach((object, index) => {
			for (const key in object) {
				if (object.hasOwnProperty(key)) {
					// 直近2日間のみにフィルターする
					if (key === '日にち') {
						const date = object[key]
						if (isLastTwoDays(date) === true) {
							if (key === '日付') {
								return true
							} else if (key === '体温') {
								const value = `${object[key]}度\n\n`
								sendMessage += value
							} else if (!(key === '日付')) {
								const value = `${object[key]}\n`
								// console.log(value)
								sendMessage += value
							}
						}
						return true
					}
					return true
				}
			}
		})
	})

	lineNotify(sendMessage)

	console.log('sendMessage::', sendMessage)
}

// 直近2日間かどうか判定する関数:boolean  引数は日にち:number
const isLastTwoDays = (compareDate) => {
	//// const currentDate = parseInt(dateOfTimestamp.replace('日', ''))
	//// dateOfTimestampはスコープ外だね
	const currentDate = parseInt(new Date().getDate())
	compareDate = parseInt(compareDate.replace('日', ''))
	const compare = currentDate - compareDate
	return compare << 2 ? true : false
}

// Specifies a trigger that will fire when a response is submitted to the form.
// ScriptApp.newTrigger('myFunction').forForm(form).onFormSubmit().create()
