// ==UserScript==
// @name         Listing查看工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.com/*
// @match        http://127.0.0.1:5555/*
// @icon         http://amazon.com/favicon.ico
// @run-at       document-body
// @grant        GM_addStyle
// ==/UserScript==

;(function () {
  'use strict'

  // Create the button element
  var button = document.createElement('div')
  button.id = 'my-button'
  button.title = 'Click me!'
  button.addEventListener('click', function () {
    // Create the popup when the button is clicked
    var popup = document.createElement('div')
    var header = document.createElement('div')
    var textarea = document.createElement('textarea')
    var table = document.createElement('table')
    var footer = document.createElement('div')
    var closeButton = document.createElement('button')
    var submitButton = document.createElement('button')

    popup.id = 'my-popup'
    header.innerHTML = '<h2>Header</h2>'

    var targetText = document.querySelector('#title_feature_div').innerText
    // textarea.placeholder = 'Write something here...'
    textarea.placeholder = targetText
    var arr = statWordFreq(targetText, [])
    console.log(arr)
    table.classList = 'word-freq-results'
    table.innerHTML = `<thead>
        <tr>
          <th>单词</th>
          <th>次数</th>
        </tr>
      </thead>
      <tbody></tbody>`
    //----------------

    const wordFreqResults = table.querySelector('.word-freq-results tbody')
    // 插入新的单词频率统计结果
    for (let i = 0; i < arr.length; i++) {
      const wordFreq = arr[i]
      const tr = document.createElement('tr')
      const tdWord = document.createElement('td')
      const tdCount = document.createElement('td')

      tdWord.innerText = wordFreq.name
      tdCount.innerText = wordFreq.value

      tr.appendChild(tdWord)
      tr.appendChild(tdCount)

      wordFreqResults.appendChild(tr)
    }
    //-------
    closeButton.textContent = 'Close'
    submitButton.classList = 'btn-calc-word-count'
    submitButton.textContent = 'Submit'
    closeButton.addEventListener('click', function () {
      popup.remove()
      backdrop.remove()
      document.body.classList.remove('modal-open')
      textarea.value = ''
    })

    // Add elements to the popup
    popup.appendChild(header)
    popup.appendChild(textarea)
    popup.appendChild(table)
    footer.appendChild(closeButton)
    footer.appendChild(submitButton)
    popup.appendChild(footer)

    // Add some styles to make the popup look good
    GM_addStyle(
      '#my-popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; padding: 20px; background-color: #fff; border-radius: 5px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.5); }'
    )
    GM_addStyle(
      '#my-popup h2 { margin: 0; padding: 10px 0; text-align: center; }'
    )
    GM_addStyle(
      '#my-popup textarea { width: 100%; height: 80px; padding: 10px; box-sizing: border-box; resize: none; border-radius: 5px; border: 1px solid #ccc; }'
    )
    GM_addStyle(
      '#my-popup table { width: 100%; border-collapse: collapse; margin: 10px 0; }'
    )
    GM_addStyle('#my-popup table td { border: 1px solid #ccc; padding: 5px; }')
    GM_addStyle(
      '#my-popup button { display: block; margin: 0 auto; padding: 5px 10px; border: none; border-radius: 5px; background-color: #fc8303; color: #fff; font-size: 16px; cursor: pointer; }'
    )

    // Create a backdrop and make the body not scrollable
    var backdrop = document.createElement('div')
    backdrop.classList.add('modal-backdrop')
    document.body.insertBefore(backdrop, button)
    document.body.classList.add('modal-open')

    // Add the popup to the page
    document.body.insertBefore(popup, backdrop)
  })

  // Add some styles to make the button look good
  GM_addStyle(
    '#my-button { position: fixed; right: 20px; bottom: 20px; width: 64px; height: 64px; background-color: #fc8303; border-radius: 50%; z-index: 9999; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.5); }'
  )
  GM_addStyle(
    '#my-button:before { content: "+"; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 32px; color: #fff; }'
  )
  GM_addStyle(
    '.modal-backdrop { position: fixed; top: 0; left: 0; z-index: 9998; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(10px); overflow: hidden; }'
  )
  GM_addStyle('.modal-open { overflow: hidden; }')

  // Add the button to the page
  document.body.appendChild(button)

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
      .replace(/\s+/g, ',') // 统计字符数
    var totalCharNum = replacedVal.length
    console.log('totalCharNum: ', totalCharNum) // 替换所有换行符
    var noLineBreakVal = replacedVal.replace(/\n/g, '') // 查找并匹配单词
    var matchedWords = noLineBreakVal.match(/[a-z]+[-']?[a-z]*/gi) || []
    console.log(matchedWords) // 对单词进行统计排序
    var wordStat = statWordFreq(noLineBreakVal, options, stopArr)
    console.log(wordStat)
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
})()
