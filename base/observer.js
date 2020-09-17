//　修改　array 实例的原型，拦截　push　等数组操作
let proto = Object.create(Array.prototype);

["push","shift","splice"].forEach(method=>{
    proto[method] = function (...parms) {// 给数组增加的参数可能是个对象，也需要被监控
        console.log("视图更新")
        let insterted;
        switch (method) {
            case "push":
            case "unshift":
                insterted = parms
                break
            case "splice":
                insterted = parms.slice(2)
                break
            default:
                break
        }
        observeArray(insterted)
        Array.prototype[method].call(this, ...insterted)
    }
})

function observeArray(obj) {
    for (let i of obj){
        // 对数组中的对象提供响应式支持
        Object.setPrototypeOf(obj,proto)
        observer(i)
    }
}

// 观察一个数据　
function observer(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj
    }
    if (Array.isArray(obj)) {
        observeArray(obj)
    } else {
        // 处理对象的
        for (let key of Reflect.ownKeys(obj)) {
            defineReactive(obj, key, obj[key])
        }
    }
}

function defineReactive(obj, key, value) {
    observer(value)
    Reflect.defineProperty(obj, key, {
        get() {
            return value
        },
        set(newValue) {
            if (value !== newValue) {// 给某个key设置值的时候，可能也是一个对象
                observer(newValue)
                value = newValue
                console.log("视图更新")
            }
        }
    })
}

let data = {
    name: [12,3],
    info: {
        phone: 123
    },
    objs: [{a:21}]
}

observer(data)

data.objs.push(12,23,{a:122})
console.log(data.objs)