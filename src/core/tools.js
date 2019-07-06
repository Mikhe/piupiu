const getDiff = (x, y) => {
    return Math.abs(Number(x) - Number(y));
};

// update sprite positions
const updatePosition = (obj) => {
    obj.position = obj.position === obj.maxPosition ? 0 : ++obj.position;
};

export {
    getDiff,
    updatePosition,
}