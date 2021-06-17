let productModal = null;
let delProductModal = null;

Vue.createApp({
  data(){
    return{
      url:'https://vue3-course-api.hexschool.io/',
      path: 'amber-hexschool',
      products: [], //產品清單
      isNewProduct: false,//判斷新增/編輯狀態
      tempProduct: { //暫存資料結構
        imagesUrl: [],
      },
    }
},
methods: {
//取得產品
  getData(){
    axios.get(`${this.url}api/${this.path}/admin/products`)
    .then(res =>{
      if(res.data.success){
        this.products = res.data.products;
      } else {
        alert(res.data.message);
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  //modal
  openModal(isNewProduct, item) { //isNewProduct分辨新增/編輯/刪除  item->v-for
    if(isNewProduct === 'new') {
      this.tempProduct = { //避免編輯後再按新增會留到同個暫存資料
        imagesUrl: [],
      };
      this.isNewProduct = true;
      productModal.show();
    } else if(isNewProduct === 'edit') {
      this.tempProduct = { ...item }; //淺層拷貝避免連棟改到原始資料
      this.isNewProduct = false;
      productModal.show();
    } else if(isNewProduct === 'delete') {
      this.tempProduct = { ...item };
      delProductModal.show();
    }
  },
  //新增/編輯產品
  updateProduct() {
     // 預設為新增
    let url = `${this.url}api/${this.path}/admin/product`;
    let httpMethod = 'post';
  
     // 根據 isNewProduct 來判斷要串接 post(新增)或是 put(編輯)API
    if(!this.isNewProduct) { 
      url = `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`;
      httpMethod = 'put'
    }
  
    axios[httpMethod](url,  { data: this.tempProduct })
      .then((response) => {
      if(response.data.success) {
        alert(response.data.message);
        productModal.hide();// 關掉 modal
        this.getData();//重新渲染資料畫面
      } else {
        alert(response.data.message);
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  //刪除單一產品
  deleteProduct() {
    axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`)
      .then((response) => {
      if (response.data.success) {
        alert(`已刪除「${this.tempProduct.title}」商品`);
        delProductModal.hide();
        this.getData();
      } else {
        alert(response.data.message);
      }
    }).catch((err) => {
      console.log(err);
    })
  },
  createImages() {
    this.tempProduct.imagesUrl = [];
    this.tempProduct.imagesUrl.push('');
  },
},
mounted(){
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }
      axios.defaults.headers.common.Authorization = token;
      this.getData();
      
      // Bootstrap Modal實體掛載
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false
      });
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false
      });
},
}).mount('#app');