import { HomePage } from "./homePage";

export class CategoryProductsPage extends HomePage {
    get womenTopsProductsText() {
        return this.page.getByText('Women - Tops Products')
    }
    
    get menJeansProductsText() {
        return this.page.getByText('Men - Jeans Products')
    }
}