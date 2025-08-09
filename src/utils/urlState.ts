export interface URLParams {
  accountBalance?: string
  riskPercent?: string
  currencyPair?: string
  entryPrice?: string
  stopLossPips?: string
  leverage?: string
  conversionRate?: string
  isShort?: string
}

export function saveToURL(params: URLParams): void {
  const url = new URL(window.location.href)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  })
  
  window.history.replaceState({}, '', url.toString())
}

export function loadFromURL(): URLParams {
  const url = new URL(window.location.href)
  const params: URLParams = {}
  
  const accountBalance = url.searchParams.get('accountBalance')
  if (accountBalance) params.accountBalance = accountBalance
  
  const riskPercent = url.searchParams.get('riskPercent')
  if (riskPercent) params.riskPercent = riskPercent
  
  const currencyPair = url.searchParams.get('currencyPair')
  if (currencyPair) params.currencyPair = currencyPair
  
  const entryPrice = url.searchParams.get('entryPrice')
  if (entryPrice) params.entryPrice = entryPrice
  
  const stopLossPips = url.searchParams.get('stopLossPips')
  if (stopLossPips) params.stopLossPips = stopLossPips
  
  const leverage = url.searchParams.get('leverage')
  if (leverage) params.leverage = leverage
  
  const conversionRate = url.searchParams.get('conversionRate')
  if (conversionRate) params.conversionRate = conversionRate
  
  const isShort = url.searchParams.get('isShort')
  if (isShort) params.isShort = isShort
  
  return params
}

export function shareURL(): string {
  return window.location.href
}