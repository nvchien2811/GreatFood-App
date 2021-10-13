export const getPriceVND = (value) => {
    const parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const price = parts.join(".");
    return price;
}