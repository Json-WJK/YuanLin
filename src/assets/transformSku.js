
export default class TransformSku {
    constructor(data){
        this.transform(data)
    }
    transform(data){
        console.log("js文件接收的数据",data)
        let sku = {}
        let transformSku = {}
        let renderSku = []
        let len = 0
        
        if (data.isMultiSpec == 1) {    // 判断是否支持多规格
            data.props.forEach(element => {    // 处理sku为规格名为key的Object
                
                if (element.items){
                    sku[element.name] = {
                        names: element.items,
                        id: element.id
                    }
                }
            })//获取规格标题名称与id
            // console.log(sku,"sku")
            for(let i in sku) {    // 遍历规格 sku[i] == 口味 || 规格 及其子分类
                
                sku[i].names.forEach(element => { //element为微辣 不辣   大份 小份
                    
                    if (!transformSku[i]) transformSku[i] = {}
                    
                    transformSku[i][element] = []
                    
                    data.sku.forEach(eles => {  //data.sku  === 不同的搭配 价格 搭配的规格名称  code 等等
                        
                        eles.value.forEach(ele => {  //ele === props_id 和 value 搭配的规格名称 与 props_id
                            //sku为data.props  ele为data.sku
                            console.log("判定是否通过",ele.props_id,sku[i].id,ele.value,element)
                            if (ele.props_id == sku[i].id && ele.value == element) { 
                                
                                let key
                                if(data.props.length >= 2){    // 规格为 2 种
                                    key = eles.value.filter(item => {   //item为data.sku.value  === 一种搭配方式 props_id和value
                                        return item.props_id != sku[i].id  //sku为props
                                    })[0].value
                                } else { // 规格为 1 种
                                    key = eles.value.filter(item => {
                                        return item.props_id == sku[i].id
                                    })[0].value
                                }
                                console.log("通过判断得到的key",i,element,key)
                                //i === 下标  element === 微辣 不辣  大份 小份   key === 微辣 等等
                                transformSku[i][element][key] = {
                                    name: key,
                                    market_price: eles.market_price,
                                    price: eles.price,
                                    stock: eles.stock,
                                    skucode: eles.skucode,
                                    icon: eles.img && eles.img[0]
                                }
                                
                            }

                        })

                    })
                })
            }
            // console.log(transformSku,"最终得到的数据transformSku")
            for (let i in transformSku) {
                let obj = {
                    name: i,
                    item: []
                }
                for (let key in transformSku[i]) {
                    obj.item.push({
                        name: key,
                        status: true,
                        selected: false
                    })
                }
                len++
                renderSku.push(obj)
            }
            this.$renderSku = renderSku
            this.$transformSku = transformSku
            this.length = len
            //将最终数据return
            return this
        }else {
            this.message = '不支持多规格'
            return this
        }
    }

    contrast(firstname, lastname){
        this.$renderSku.forEach(element => {
            if (element.name !== firstname) {
                for (let i in this.$transformSku[firstname][lastname]) {
                    let curx = this.$transformSku[firstname][lastname][i]
                    element.item.forEach(item => {
                        if (item.name == i) {
                            item.status = curx.stock > 0 ? true : false
                        }
                    })
                }
            }
        })
        return this.$renderSku
    }

    getSkuCode(val1, val2){//选中规格函数
        // console.log("getSkuCode执行了")
        console.log("val1,val2",val1,val2,this.$transformSku)
        if(val1 && val2){
            for(let i in this.$transformSku){
                // console.log("选中了双规格",this.$transformSku)
                console.log("打印测试0",this.$transformSku[i][val1])
                if (this.$transformSku[i][val1]){
                    console.log("打印测试1",this.$transformSku[i][val1][val2])
                    return this.$transformSku[i][val1][val2].skucode
                } else if (this.$transformSku[i][val2]){
                    console.log("打印测试1",this.$transformSku[i][val2][val1])
                    return this.$transformSku[i][val2][val1].skucode
                }
            }
            return ''
        }else if(val1){
            for (let i in this.$transformSku) {
                // console.log("选中了单规格",this.$transformSku)
                if (this.$transformSku[i][val1][val1]) {
                    return this.$transformSku[i][val1][val1].skucode
                }
            }
            return ''
        }
        return ''
    }

    getPrice(val1, val2){
        if (val1 && val2) {
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1]) {
                    return this.$transformSku[i][val1][val2].price
                } else if (this.$transformSku[i][val2]) {
                    return this.$transformSku[i][val2][val1].price
                }
            }
            return 0
        }else if(val1){
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1][val1]) {
                    return this.$transformSku[i][val1][val1].price
                }
            }
            return 0
        }
        return 0
    }

    getStock(val1, val2){
        if (val1 && val2) {
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1]) {
                    return this.$transformSku[i][val1][val2].stock
                } else if (this.$transformSku[i][val2]) {
                    return this.$transformSku[i][val2][val1].stock
                }
            }
            return 0
        }else if(val1){
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1][val1]) {
                    return this.$transformSku[i][val1][val1].stock
                }
            }
            return 0
        }
        return 0
    }

    getIcon(val1, val2){
        if (val1 && val2) {
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1]) {
                    return this.$transformSku[i][val1][val2].icon
                } else if (this.$transformSku[i][val2]) {
                    return this.$transformSku[i][val2][val1].icon
                }
            }
            return ''
        }else if(val1){
            for (let i in this.$transformSku) {
                if (this.$transformSku[i][val1][val1]) {
                    return this.$transformSku[i][val1][val1].icon
                }
            }
            return ''
        }
        return ''
    }

}
