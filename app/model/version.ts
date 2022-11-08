import { Application } from "egg";

export default function (app: Application) {

    const { STRING, INTEGER, DATE } = app.Sequelize
    const Model = app.model.define('version', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(50), allowNull: true },
        version_code: { type: STRING(50), allowNull: true },
        year: { type: STRING(5), allowNull: false },
        num: { type: INTEGER, allowNull: true },
        update_time: { type: DATE, allowNull: true },
        live_time: { type: DATE, allowNull: true },
        test_num: { type: INTEGER, allowNull: true },
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true
    })

    return class Version extends Model {
        static associate() {
            (app.model.Version).hasMany(app.model.Dev, { as: "dev", foreignKey: 'version_id', })
        }
    };

}