import { Application } from "egg";

export default function (app: Application) {

    const { STRING, INTEGER } = app.Sequelize
    const Model = app.model.define('tech', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(50), allowNull: true },
        keyword: { type: INTEGER, allowNull: false },
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true
    })

    return class Tech extends Model {
        static associate() {
            (app.model.Tech).hasMany(app.model.Dev, { as: "dev", foreignKey: 'tech_id', })
        }
    };

}