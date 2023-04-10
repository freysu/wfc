// prettier-ignore
var grammarWords = ['about', 'after', 'ago', 'all', 'also', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'before', 'both', 'but', 'by', 'can', 'did', 'do', 'does', 'done', 'edit', 'even', 'every', 'for', 'from', 'had', 'has', 'have', 'he', 'here', 'him', 'his', 'however', 'if', 'in', 'into', 'is', 'it', 'its', 'less', 'many', 'may', 'more', 'most', 'much', 'my', 'no', 'not', 'often', 'quote', 'of', 'on', 'one', 'only', 'or', 'other', 'our', 'out', 're', 'says', 'she', 'so', 'some', 'soon', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'though', 'through', 'to', 'under', 'use', 'using', 've', 'was', 'we', 'were', 'what', 'where', 'when', 'whether', 'which', 'while', 'who', 'whom', 'with', 'within', 'you', 'your'];

const inputFile = document.getElementById('input-file')
const fileContents = document.getElementById('file-contents')
const btnCalcWordCount = document.querySelector('.btn-calc-word-count')
const wordFreqResults = document.querySelector('.word-freq-results tbody')

function readFile(inputFile, fileType, callback) {
  try {
    const file = inputFile.files[0]
    const reader = new FileReader()

    // 根据文件类型设置读取方式（文本或二进制）
    if (fileType === 'text') {
      reader.readAsText(file)
    } else if (fileType === 'excel') {
      reader.readAsBinaryString(file)
    }

    reader.onload = function (event) {
      callback(event.target.result)
    }
  } catch (error) {
    console.log('error: ', error)
  }
}

// 调用示例
const textFileInput = document.getElementById('textFileInput')
const excelFileInput = document.getElementById('excelFileInput')

textFileInput.addEventListener('change', function () {
  readFile(textFileInput, 'text', function (contents) {
    // 处理读取到的文本内容
    console.log(contents)
    fileContents.value = contents
  })
})

excelFileInput.addEventListener('change', function () {
  readFile(excelFileInput, 'excel', function (data) {
    // 使用 SheetJS 或其他库处理读取到的 Excel 数据
    const workbook = XLSX.read(data, { type: 'binary' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)
    console.log(rows)
    var keywordArr = []
    rows.map((arr, idx) => {
      keywordArr.push(arr['keyword'])
    })
    fileContents.value = keywordArr.join('\n')
  })
})

$('.btn-clear-file-contents').click(() => {
  $('#file-contents').val('')
  $(wordFreqResults).empty()
  $('.btn-export-word-count').hide()
  $('#num_character').text(0)
  $('#num_word').text(0)
  $('#num_sentence').text(0)
})

$(btnCalcWordCount).click(function () {
  const options = {
    caseSensitive: false // 是否区分大小写
  }
  var stopArr = []
  const isIncludeGrammarWords =
    document.getElementById('row-selection2').value !== 'yes' ? false : true

  console.log('isIncludeGrammarWords: ', isIncludeGrammarWords)
  const wordTypeIndex =
    parseInt(document.getElementById('row-selection1').value) - 1

  const fileContent = fileContents.value
  // const wordFreqArr = statWord(fileContent, stopArr, options)
  const wordFreqArr = getWordFreq(fileContent, stopArr, options)[wordTypeIndex]
  // console.log('wordFreqArr1: ', wordFreqArr1)
  console.log('wordFreqArr: ', wordFreqArr)

  // 清空表格内容
  wordFreqResults.innerHTML = ''
  $('#wordTypeIndex').text(wordTypeIndex + 1)
  renderWordFreqResults(wordFreqArr, wordTypeIndex, isIncludeGrammarWords)
  // // 插入新的单词频率统计结果
  // for (let i = 0; i < wordFreqArr.length; i++) {
  //   const wordFreq = wordFreqArr[i]
  //   const tr = document.createElement('tr')
  //   const tdWord = document.createElement('td')
  //   const tdCount = document.createElement('td')

  //   tdWord.innerText = wordFreq.name
  //   tdCount.innerText = wordFreq.value

  //   tr.appendChild(tdWord)
  //   tr.appendChild(tdCount)

  //   wordFreqResults.appendChild(tr)
  // }
  $(wordFreqResults).children().length && $('.btn-export-word-count').show()
})

// 插入新的单词频率统计结果
function renderWordFreqResults(
  wordFreqArr = [],
  wordTypeIndex,
  isInclude = false
) {
  var totalNumWord = $('#num_word').text()
  wordFreqResults.innerHTML = ''
  var selectValue = document.getElementById('row-selection').value
  const selectedRows = !isNaN(selectValue)
    ? parseInt(selectValue)
    : wordFreqArr.length
  var idx = 0
  for (let i = 0; i < selectedRows && i < wordFreqArr.length; i++) {
    const wordFreq = wordFreqArr[i]
    if (
      !isInclude &&
      (grammarWords.indexOf(wordFreq[0]) > -1 || wordFreq[0].length == 1)
    ) {
      continue
    } else {
      const tr = document.createElement('tr')
      const tdIdx = document.createElement('td')
      const tdWord = document.createElement('td')
      const tdCount = document.createElement('td')
      const tdPer = document.createElement('td')

      tdWord.innerText = wordFreq[0]
      tdCount.innerText = wordFreq[1]
      tdIdx.innerText = +idx + 1
      var tmp = 0
      if (wordTypeIndex > 0) {
        tmp = totalNumWord - 1
      } else {
        tmp = totalNumWord
      }
      tdPer.innerText = Math.round(((100 * wordFreq[1]) / tmp) * 10) / 10 + '%'

      tr.appendChild(tdIdx)
      tr.appendChild(tdWord)
      tr.appendChild(tdCount)
      tr.appendChild(tdPer)

      wordFreqResults.appendChild(tr)
      idx++
    }
  }
}

$('.btn-export-word-count').click(function () {
  if ($(wordFreqResults).children().length) {
    exportTable()
  } else {
    alert('暂无数据可以导出！')
  }
})

// 导出表格数据
function exportTable() {
  const table = document.querySelector('.word-freq-results')
  const workbook = XLSX.utils.table_to_book(table)
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'table.xlsx'
  )
}

// 文件流转BinaryString
function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}

function uniqueArray(arr) {
  return Array.from(new Set(arr))
}

/**
 * 统计单词出现频率
 * @param {*} value 待统计值
 * @param {*} options 统计选项
 * @param {*} stopArr 停用词列表
 * @returns {*} 统计结果数组
 */
function statWord(targetValue, stopArr, options) {
  // // 获取目标元素文本
  // // 获取目标元素值
  // var targetValue = $('#target').val() // 去除首尾空格
  var trimmedVal = targetValue.trim() // 替换换行符和空格
  var replacedVal = trimmedVal
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\n')
    .replace(/\s+/g, ',')
  var totalCharNum = replacedVal.length // 统计字符数
  console.log('统计字符数: ', totalCharNum)
  var noLineBreakVal = replacedVal.replace(/\n/g, '') // 查找并匹配单词
  var matchedWords = noLineBreakVal.match(/[a-z]+[-']?[a-z]*/gi) || []
  var wordStat = statWordFreq(noLineBreakVal, options, stopArr)
  return wordStat

  function statWordFreq(val, options, stopArr) {
    var replacedVal = val
      .replace(/\t/g, ',')
      .replace(/\n\t/g, ',')
      .replace(/\r/g, ',')
      .replace(/\r\n/g, ',')
      .replace(/\n/g, ',')
      .replace(/\s+/g, ',')

    replacedVal = options?.caseSensitive
      ? replacedVal
      : replacedVal.toLowerCase()
    var matchedWords = replacedVal.match(/[a-z]+[-']?[a-z]*/gi) || []
    var wordFreqArr = new Array()
    const filteredWords = matchedWords.filter((word) => {
      return !stopArr.find((s) => {
        return s.indexOf(word) !== -1 || s === word
      })
    })
    console.log(filteredWords.length, filteredWords)
    for (var i = 0; i < filteredWords.length; i++) {
      var isNewWord = false
      for (var j = 0; j < wordFreqArr.length; j++) {
        if (filteredWords[i] == wordFreqArr[j].name) {
          wordFreqArr[j].value++
          isNewWord = true
          break
        }
      }
      if (!isNewWord) {
        var newWord = new Object()
        newWord.name = filteredWords[i]
        newWord.value = 1
        wordFreqArr.push(newWord)
      }
    }
    wordFreqArr.sort(function (word1, word2) {
      return word2.value - word1.value
    })
    return wordFreqArr
  }
}

function getWordFreq(targetValue, withExtraStatistics = false) {
  var trimmedVal = targetValue.trim() // 替换换行符和空格
  var replacedVal = trimmedVal
    .replace(/[^a-zA-Z0-9.-]+/g, '\n\t')
    .replace(/\t/g, ',')
    .replace(/\n\t/g, ',')
    .replace(/\r/g, ',')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\n')
    .replace(/\s+/g, ',')
    .replace(/\s+/g, ',')
  var noLineBreakVal = replacedVal.replace(/\n/g, '') // 查找并匹配单词
  // var matchedWords = noLineBreakVal.match(/[a-z]+[-']?[a-z]*/gi) || []
  // console.log('matchedWords: ', matchedWords)
  var wccInfo = $.wordCountTool.getwccInfo(noLineBreakVal, withExtraStatistics)
  const {
    num_character,
    num_word,
    num_sentence,
    oneWordFrequency,
    twoWordFrequency,
    threeWordFrequency
  } = wccInfo
  $('#num_character').text(num_character)
  $('#num_word').text(num_word)
  $('#num_sentence').text(num_sentence)
  return [oneWordFrequency, twoWordFrequency, threeWordFrequency]
}

function handleWordFeqArr(targetArr, isInclude = false) {
  if (isInclude) {
  }
}
