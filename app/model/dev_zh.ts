import { Application } from "egg";

export default function (app: Application) {

    const { STRING, INTEGER, TEXT, DATE } = app.Sequelize
    const Model = app.model.define('dev_zh', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(255), allowNull: false },
        link: { type: TEXT, allowNull: true },
        intro: { type: STRING(255), allowNull: true },
        img: { type: TEXT, allowNull: false },
        lang: { type: STRING(5), allowNull: false },
        info: { type: STRING(255), allowNull: true },
        time: { type: DATE, allowNull: false },
        recording_time: { type: DATE, allowNull: false },
        real_time_slot: { type: STRING(100), allowNull: true },
        dev_id: { type: INTEGER, allowNull: true }
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true
    })

    return class DevZh extends Model {
        static associate() {
            (app.model.DevZh as any).belongsTo(app.model.Dev, { foreignKey: 'dev_id', targetKey: 'id' });
        }
    };

}