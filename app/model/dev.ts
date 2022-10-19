import { Application } from "egg";

export default function (app: Application) {

    const { STRING, INTEGER } = app.Sequelize
    const Model = app.model.define('dev', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        type: { type: STRING(10), allowNull: true },
        version_id: { type: INTEGER, allowNull: false },
        tech_id: { type: INTEGER, allowNull: true },
        // zh_id: { type: INTEGER, allowNull: true },
        // en_id: { type: INTEGER, allowNull: true },
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true
    })

    return class Dev extends Model {
        static associate() {
            (app.model.Dev as any).hasOne(app.model.DevZh, { as: 'zh',foreignKey: 'dev_id' ,targetKey:'id' });
            (app.model.Dev as any).hasOne(app.model.DevEn, { as: 'en',foreignKey: 'dev_id' ,targetKey:'id' });
        }
    };

}