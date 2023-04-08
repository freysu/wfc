const inputFile = document.getElementById('input-file')
const fileContents = document.getElementById('file-contents')
const btnCalcWordCount = document.querySelector('.btn-calc-word-count')
const wordFreqResults = document.querySelector('.word-freq-results tbody')

inputFile.addEventListener('change', function () {
  const file = inputFile.files[0]
  const reader = new FileReader()

  // 确保文件类型为文本文件
  if (!file.type.match('text.*')) {
    alert('请上传文本文件(.txt)')
    return
  }

  reader.onload = function (event) {
    fileContents.value = event.target.result
  }

  reader.readAsText(file)
})

btnCalcWordCount.addEventListener('click', function () {
  const options = {
    caseSensitive: false // 是否区分大小写
  }
  const stopArr = stopWordsInEnglish

  const fileContent = fileContents.value
  const wordFreqArr = statWordFreq(fileContent, stopArr, options)
  console.log('wordFreqArr: ', wordFreqArr)

  // 清空表格内容
  wordFreqResults.innerHTML = ''

  // 插入新的单词频率统计结果
  for (let i = 0; i < wordFreqArr.length; i++) {
    const wordFreq = wordFreqArr[i]
    const tr = document.createElement('tr')
    const tdWord = document.createElement('td')
    const tdCount = document.createElement('td')

    tdWord.innerText = wordFreq.name
    tdCount.innerText = wordFreq.value

    tr.appendChild(tdWord)
    tr.appendChild(tdCount)

    wordFreqResults.appendChild(tr)
  }
})

/**
 * 统计单词出现频率
 * @param {*} value 待统计值
 * @param {*} options 统计选项
 * @param {*} stopArr 停用词列表
 * @returns {*} 统计结果数组
 */
function statWordFreq(targetValue, stopArr, options) {
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
