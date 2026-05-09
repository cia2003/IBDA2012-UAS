import { useParams } from "react-router-dom"

function ProductDetails() {
    const {productId} = useParams()
    return (
        <div>
            <h1>Product Details Page</h1>
            <p>Product ID: {productId}</p>
        </div>
    )
}

export default ProductDetails
