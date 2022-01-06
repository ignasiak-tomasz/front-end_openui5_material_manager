sap.ui.define(function(){
    return{

        nameProduct: function(IdProduct){
            
            if(!this.oModelFormatter){
                this.oModelFormatter = this.getView().getModel("products");
            }
            let oModelData = this.oModelFormatter.getData();
            for(let i = 0; i < oModelData.length; i++ ){
                if(oModelData[i].id === IdProduct)
                    return oModelData[i].nazwa
            }
        },
        categoryProduct: function(IdProduct){
            
            if(!this.oModelFormatter){
                this.oModelFormatter = this.getView().getModel("products");
            }
            let oModelData = this.oModelFormatter.getData();
            for(let i = 0; i < oModelData.length; i++ ){
                if(oModelData[i].id === IdProduct)
                    return oModelData[i].kategoria.nazwa
            }
        }
    };
});