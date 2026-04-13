"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temas = void 0;
const generic_entity_1 = require("../../generic/generic.entity");
const typeorm_1 = require("typeorm");
const unidades_entity_1 = require("./unidades.entity");
let Temas = class Temas extends generic_entity_1.GenericEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Temas.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Temas.prototype, "id_unidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Temas.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Temas.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Temas.prototype, "numero_tema", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unidades_entity_1.Unidades, unidad => unidad.temas),
    (0, typeorm_1.JoinColumn)({ name: 'id_unidad', referencedColumnName: 'id' }),
    __metadata("design:type", unidades_entity_1.Unidades)
], Temas.prototype, "unidad", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: false,
        default: () => "'[]'",
        transformer: {
            to: (value) => {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    return '[]';
                }
                return JSON.stringify(value);
            },
            from: (value) => {
                if (!value || value === '' || value === 'null') {
                    return [];
                }
                try {
                    return typeof value === 'string' ? JSON.parse(value) : value;
                }
                catch (error) {
                    console.error('Error parsing subtemas:', error);
                    return [];
                }
            }
        }
    }),
    __metadata("design:type", Array)
], Temas.prototype, "subtemas", void 0);
Temas = __decorate([
    (0, typeorm_1.Entity)()
], Temas);
exports.Temas = Temas;
//# sourceMappingURL=temas.entity.js.map