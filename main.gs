const form = FormApp.openById('1qieEigvsY-duGK9Ju5a8DouQuWDt6KMIztqlte9Amv8')
function myFunction() {
	// Open a form by ID and log the responses to each question.
	const formResponses = form.getResponses()
	let sendMessage = ''

	formResponses.forEach((formResponse) => {
		const itemResponses = formResponse.getItemResponses()
		// ヘッダーの初期化
		const tableHeaders = []
		// 2行目以降のitemsの初期化
		const tableRows = []
		// テーブル(スプレッドシート)を1行ずつループしていく
		itemResponses.forEach((itemResponse, index) => {
			// ヘッダーを取得する
			const tableHeader = itemResponse.getItem().getTitle()
			tableHeaders.push(tableHeader)

			// ヘッダー以外を取得する
			const tableRow = {}
			const item = itemResponse.getResponse()
			tableRow[tableHeaders[index]] = item
			tableRows.push(tableRow)
		})

		// console.log('tableRows:', tableRows)
		tableRows.forEach((object, index) => {
			for (const key in object) {
				if (object.hasOwnProperty(key)) {
					if (key === '体温') {
						const element = `${object[key]}\n\n`
						sendMessage += element
						return true
					}
					const element = `${object[key]}\n`
					console.log(element)
					sendMessage += element
				}
			}
		})
	})

	lineNotify(sendMessage)
}

// Specifies a trigger that will fire when a response is submitted to the form.
ScriptApp.newTrigger('myFunction').forForm(form).onFormSubmit().create()
