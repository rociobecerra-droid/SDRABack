"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const objetos_aprendizaje_entity_1 = require("../unidades/entities/objetos_aprendizaje.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const typeorm_1 = require("@nestjs/typeorm");
async function migrarPublicIds() {
    console.log('🚀 Iniciando migración de public_ids de Cloudinary...\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const objetosRepository = app.get((0, typeorm_1.getRepositoryToken)(objetos_aprendizaje_entity_1.ObjetosAprendizaje));
        const cloudinaryService = app.get(cloudinary_service_1.CloudinaryService);
        const objetos = await objetosRepository.find({
            where: { cloudinary_public_id: null }
        });
        console.log(`📊 Encontrados ${objetos.length} objetos para migrar\n`);
        let exitosos = 0;
        let fallidos = 0;
        let omitidos = 0;
        for (const objeto of objetos) {
            try {
                if (!objeto.contenido || !objeto.contenido.includes('cloudinary')) {
                    console.log(`⚠️  [${objeto.id}] ${objeto.nombre} - No tiene URL de Cloudinary (omitido)`);
                    omitidos++;
                    continue;
                }
                const publicId = cloudinaryService.extractPublicId(objeto.contenido);
                if (!publicId) {
                    throw new Error('No se pudo extraer el public_id');
                }
                await objetosRepository.update(objeto.id, {
                    cloudinary_public_id: publicId
                });
                console.log(`✅ [${objeto.id}] ${objeto.nombre}`);
                console.log(`   📁 Public ID: ${publicId}\n`);
                exitosos++;
            }
            catch (error) {
                console.error(`❌ [${objeto.id}] ${objeto.nombre} - Error: ${error.message}\n`);
                fallidos++;
            }
        }
        console.log('\n' + '='.repeat(60));
        console.log('🎉 Migración completada:');
        console.log(`   ✅ Exitosos: ${exitosos}`);
        console.log(`   ❌ Fallidos: ${fallidos}`);
        console.log(`   ⚠️  Omitidos: ${omitidos}`);
        console.log(`   📊 Total: ${objetos.length}`);
        console.log('='.repeat(60) + '\n');
    }
    catch (error) {
        console.error('❌ Error fatal durante la migración:', error);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
migrarPublicIds()
    .then(() => {
    console.log('✨ Script finalizado correctamente');
    process.exit(0);
})
    .catch((error) => {
    console.error('💥 Error ejecutando el script:', error);
    process.exit(1);
});
//# sourceMappingURL=migrate-public-ids.js.map