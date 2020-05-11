import { Repository, EntityRepository } from 'typeorm';
import Category from '../models/Category';

interface CreateCategoryDTO {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrCreate({ title }: CreateCategoryDTO): Promise<Category> {
    let categoryLoaded = await this.findOne({
      where: { title },
    });

    if (!categoryLoaded) {
      categoryLoaded = this.create({ title });
      await this.save(categoryLoaded);
    }

    return categoryLoaded;
  }
}

export default CategoriesRepository;
