export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

export const calcMargin = (price, margin) => {
  return (price * margin / 100).toFixed(2)
}
