exports.getDate = function() {
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    };

    const today  = new Date();
    
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
    const options = { 
        day: 'numeric' 
    };

    const today  = new Date();
    
    return today.toLocaleDateString("en-US", options);
}