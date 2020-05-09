const form = FormApp.openById('1qieEigvsY-duGK9Ju5a8DouQuWDt6KMIztqlte9Amv8')
function myFunction() {
	// Open a form by ID and log the responses to each question.
	const formResponses = form.getResponses()
	// 送信メッセージの初期化
	let sendMessage = ''
	// ヘッダーの初期化
	const tableHeaders = []
	// 2行目以降のitemが全て入る配列の初期化
	const tableRows = []
	// ヘッダー以外の1行ずつのデータが昼オブジェクトの初期化
	const tableRow = {}

	formResponses.forEach((formResponse) => {
		const itemResponses = formResponse.getItemResponses()
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
		})

		tableRows.push(tableRow)
	})

	// 最後の投稿データだけを抽出する場合
	const lastNumOfTableRows = tableRows.length - 1
	const lastPostData = tableRows[lastNumOfTableRows]

	for (const key in lastPostData) {
		if (lastPostData.hasOwnProperty(key)) {
			if (key === '体温') {
				const value = `${lastPostData[key]}度\n\n`
				sendMessage += value
			} else if (key === '氏名') {
				const value = `\n${lastPostData[key]}\n`
				sendMessage += value
			} else {
				const value = `${lastPostData[key]}\n`
				sendMessage += value
			}
		}
	}
	console.log('sendMessage::', sendMessage)

	if (sendMessage) {
		lineNotify(sendMessage)
	}
}
