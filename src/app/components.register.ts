//import components
import { AppComponent } from './app.component';
import { LoadFileDorm2Components } from './components/load-file-dorm2/load-file-dorm2.component';

//import services
//import { ProductService } from './services/product.service';
export const bootstrap = [AppComponent];


export const componentList = [
    AppComponent, 
    LoadFileDorm2Components
];

//export const serviceList = [ProductService, UserService, LocalStorageService, CartService];