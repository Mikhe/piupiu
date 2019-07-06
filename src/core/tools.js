const getDiff = (x, y) => {
    return Math.abs(Number(x) - Number(y));
};

const getRandom = (max) => {
    return Math.floor(Math.random() * max);
};

const updatePosition = (obj) => {
    obj.position = obj.position === obj.maxPosition ? 0 : ++obj.position;
};

export {
    getDiff,
    getRandom,
    updatePosition,
}