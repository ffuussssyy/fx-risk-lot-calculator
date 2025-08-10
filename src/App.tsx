import { useState, useEffect } from 'react'
import { calculate, type CalculationResult } from './utils/calculator'
import { saveToURL, loadFromURL, shareURL } from './utils/urlState'
import { quoteCcy } from './utils/notionalCalculator'
import { formatPrice, formatCurrency, formatLot } from './utils/formatters'

function App() {
  const [accountBalance, setAccountBalance] = useState<string>('')
  const [riskPercent, setRiskPercent] = useState<string>('')
  const [currencyPair, setCurrencyPair] = useState<string>('USDJPY')
  const [entryPrice, setEntryPrice] = useState<string>('')
  const [stopLossPips, setStopLossPips] = useState<string>('')
  const [leverage, setLeverage] = useState<string>('25')
  const [conversionRate, setConversionRate] = useState<string>('')
  const [isShort, setIsShort] = useState<boolean>(false)

  const [results, setResults] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string>('')
  const [showShareMessage, setShowShareMessage] = useState<boolean>(false)

  const currencyPairs = [
    'USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'CADJPY', 'CHFJPY',
    'EURUSD', 'GBPUSD', 'AUDUSD', 'USDCAD', 'USDCHF',
    'EURGBP', 'EURAUD', 'EURCHF', 'GBPAUD', 'GBPCHF'
  ]

  const currentQuoteCcy = quoteCcy(currencyPair)
  const needsConversion = currentQuoteCcy !== 'JPY'

  useEffect(() => {
    const urlParams = loadFromURL()
    if (urlParams.accountBalance) setAccountBalance(urlParams.accountBalance)
    if (urlParams.riskPercent) setRiskPercent(urlParams.riskPercent)
    if (urlParams.currencyPair) setCurrencyPair(urlParams.currencyPair)
    if (urlParams.entryPrice) setEntryPrice(urlParams.entryPrice)
    if (urlParams.stopLossPips) setStopLossPips(urlParams.stopLossPips)
    if (urlParams.leverage) setLeverage(urlParams.leverage)
    if (urlParams.conversionRate) setConversionRate(urlParams.conversionRate)
    if (urlParams.isShort) setIsShort(urlParams.isShort === 'true')
  }, [])

  useEffect(() => {
    saveToURL({
      accountBalance,
      riskPercent,
      currencyPair,
      entryPrice,
      stopLossPips,
      leverage,
      conversionRate,
      isShort: isShort.toString()
    })
  }, [accountBalance, riskPercent, currencyPair, entryPrice, stopLossPips, leverage, conversionRate, isShort])

  const handleCalculate = () => {
    setError('')
    setResults(null)
    
    try {
      const balance = parseFloat(accountBalance)
      const risk = parseFloat(riskPercent)
      const entry = parseFloat(entryPrice)
      const stopLoss = parseFloat(stopLossPips)
      const lev = parseFloat(leverage)
      const conversion = conversionRate ? parseFloat(conversionRate) : undefined
      
      if (isNaN(balance) || balance <= 0) {
        throw new Error('口座残高を正しく入力してください')
      }
      if (isNaN(risk) || risk <= 0 || risk > 100) {
        throw new Error('リスクは0-100%の範囲で入力してください')
      }
      if (isNaN(entry) || entry <= 0) {
        throw new Error('エントリー価格を正しく入力してください')
      }
      if (isNaN(stopLoss) || stopLoss <= 0) {
        throw new Error('損切幅を正しく入力してください')
      }
      if (isNaN(lev) || lev <= 0) {
        throw new Error('レバレッジを正しく入力してください')
      }
      if (needsConversion && (!conversion || isNaN(conversion) || conversion <= 0)) {
        throw new Error(`${currentQuoteCcy}/JPY換算レートを正しく入力してください`)
      }
      
      const result = calculate({
        accountBalance: balance,
        riskPercent: risk,
        currencyPair,
        entryPrice: entry,
        stopLossPips: stopLoss,
        leverage: lev,
        conversionRate: conversion,
        isShort
      })
      
      setResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '計算エラーが発生しました')
    }
  }

  const handleShare = async () => {
    const url = shareURL()
    try {
      await navigator.clipboard.writeText(url)
      setShowShareMessage(true)
      setTimeout(() => setShowShareMessage(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const setExample1 = () => {
    setAccountBalance('1000000')
    setRiskPercent('1')
    setCurrencyPair('USDJPY')
    setEntryPrice('150')
    setStopLossPips('30')
    setLeverage('25')
    setConversionRate('')
    setIsShort(false)
    setTimeout(() => handleCalculate(), 100)
  }

  const setExample2 = () => {
    setAccountBalance('1000000')
    setRiskPercent('1')
    setCurrencyPair('EURUSD')
    setEntryPrice('1.1')
    setStopLossPips('30')
    setLeverage('25')
    setConversionRate('150')
    setIsShort(false)
    setTimeout(() => handleCalculate(), 100)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          FX リスク計算機
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              口座残高 (JPY)
            </label>
            <input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              リスク (%)
            </label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              通貨ペア
            </label>
            <select
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencyPairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エントリー価格
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="150.00"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              損切幅 (pips)
            </label>
            <input
              type="number"
              value={stopLossPips}
              onChange={(e) => setStopLossPips(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              レバレッジ
            </label>
            <select
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="25">25倍</option>
              <option value="100">100倍</option>
              <option value="200">200倍</option>
              <option value="400">400倍</option>
              <option value="1000">1000倍</option>
            </select>
          </div>

          {needsConversion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                換算レート ({currentQuoteCcy}/JPY)
              </label>
              <input
                type="number"
                value={conversionRate}
                onChange={(e) => setConversionRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150.00"
                step="0.001"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isShort"
              checked={isShort}
              onChange={(e) => setIsShort(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isShort" className="text-sm font-medium text-gray-700">
              ショートポジション
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              計算する
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
              title="URLをコピーして共有"
            >
              共有
            </button>
          </div>
          
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              onClick={setExample1}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              例①をセット
            </button>
            <button
              onClick={setExample2}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              例②をセット
            </button>
          </div>
        </div>

        {showShareMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            URLがクリップボードにコピーされました
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {results && (
          <div className={`mt-6 p-4 rounded-lg ${results.recommendedLot === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-50'}`}>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">計算結果</h2>
            <div className="mb-2 text-xs text-gray-600 italic">
              ロットは 0.01 lot刻み・切り下げで計算しています。
            </div>
            
            {results.recommendedLot === 0 && (
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-sm">
                ⚠️ 口座残高・リスク・損切を見直してください
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>許容損失額:</span>
                <span className="font-medium">{formatCurrency(results.allowableLoss)}</span>
              </div>
              <div className="flex justify-between">
                <span>推奨ロット:</span>
                <span className="font-medium">{formatLot(results.recommendedLot)}</span>
              </div>
              <div className="flex justify-between">
                <span>ユニット数:</span>
                <span className="font-medium">{results.units.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>1pip価値:</span>
                <span className="font-medium">{formatCurrency(results.pipValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>必要証拠金:</span>
                <span className="font-medium">{formatCurrency(results.requiredMargin)}</span>
              </div>
              <div className="border-t pt-2 mt-3">
                <div className="text-xs text-gray-600 mb-1">利確価格 (R:R)</div>
                <div className="flex justify-between text-xs">
                  <span>1.0:</span>
                  <span>{formatPrice(currencyPair, results.tp1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>1.5:</span>
                  <span>{formatPrice(currencyPair, results.tp15)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>2.0:</span>
                  <span>{formatPrice(currencyPair, results.tp2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-center text-xs text-gray-500 px-4">
        教育目的の試算です。実取引条件は各社仕様に依存します。
      </footer>
    </div>
  )
}

export default App
