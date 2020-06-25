import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({ where: { name } });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsId = products.map(product => product.id);

    const productList = await this.ormRepository.find({ id: In(productsId) });

    if (productList.length !== productsId.length) {
      throw new AppError('Missing a product');
    }

    return productList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productList = await this.findAllById(products);

    const newProductList = productList.map(product => {
      const prod = products.find(p => p.id === product.id);

      if (!prod) {
        throw new AppError('Product not found');
      }

      if (product.quantity < prod.quantity) {
        throw new AppError('Insufficient quantity');
      }

      const newProduct = product;
      newProduct.quantity -= prod.quantity;

      return newProduct;
    });

    await this.ormRepository.save(newProductList);

    return newProductList;
  }
}

export default ProductsRepository;
