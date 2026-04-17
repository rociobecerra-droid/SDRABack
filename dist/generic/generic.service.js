"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericService = void 0;
const common_1 = require("@nestjs/common");
class GenericService {
    constructor(repository) {
        this.repository = repository;
    }
    create(entity) {
        return this.repository.insert(entity);
    }
    find(options) {
        return this.repository.find(options);
    }
    findOne(options) {
        return this.repository.findOne(options);
    }
    findOneById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async update(id, entity) {
        const info = await this.repository.findOne({ where: { id } });
        if (!info) {
            throw new common_1.NotFoundException(`Registro con id ${id} no encontrado`);
        }
        this.repository.merge(info, entity);
        return this.repository.save(info);
    }
    delete(id) {
        return this.repository.softDelete(id);
    }
}
exports.GenericService = GenericService;
//# sourceMappingURL=generic.service.js.map