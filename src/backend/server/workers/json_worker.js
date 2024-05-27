function isEmpty(obj)
{
    return Object.keys(obj).length === 0;
}

function isNullOrEmpty(obj)
{
    return obj == null || obj.length == 0;
}

module.exports = {isEmpty, isNullOrEmpty};