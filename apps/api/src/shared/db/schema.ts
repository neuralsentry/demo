import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  smallint,
  integer,
  real,
  doublePrecision
} from "drizzle-orm/pg-core";
import { relations, InferModel } from "drizzle-orm";

export const cve = pgTable(
  "cve",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull()
  },
  (t) => ({
    name_idx: uniqueIndex("name_idx").on(t.name)
  })
);

export const cveRelations = relations(cve, ({ many }) => ({
  funcs: many(func)
}));

export type Cve = InferModel<typeof cve>;
export type NewCve = InferModel<typeof cve, "insert">;

export const func = pgTable("function", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  labels: smallint("labels").notNull(),
  num_lines: integer("num_lines").notNull(),
  cve_name: text("cve_name")
});

export const funcRelations = relations(func, ({ one, many }) => ({
  cve: one(cve, {
    fields: [func.cve_name],
    references: [cve.name]
  }),
  model_predictions: many(modelPrediction)
}));

export type Func = InferModel<typeof func>;
export type NewFunc = InferModel<typeof func, "insert">;

export const model = pgTable(
  "model",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    hf_hub_id: text("hf_hub_id").notNull(),
    accuracy: real("accuracy").notNull(),
    precision: real("precision").notNull(),
    recall: real("recall").notNull(),
    f1: real("f1").notNull()
  },
  (t) => ({
    hf_hub_id_idx: uniqueIndex("hf_hub_id_idx").on(t.hf_hub_id)
  })
);

export const modelRelations = relations(model, ({ many }) => ({
  predictions: many(modelPrediction)
}));

export type Model = InferModel<typeof model>;
export type NewModel = InferModel<typeof model, "insert">;

export const modelPrediction = pgTable("model_prediction", {
  id: serial("id").primaryKey(),
  prediction: smallint("prediction").notNull(),
  probability: doublePrecision("probability").notNull(),
  model_id: integer("model_id").notNull(),
  func_id: integer("func_id").notNull()
});

export const modelPredictionRelations = relations(
  modelPrediction,
  ({ one }) => ({
    model: one(model, {
      fields: [modelPrediction.model_id],
      references: [model.id]
    }),
    func: one(func, {
      fields: [modelPrediction.func_id],
      references: [func.id]
    })
  })
);

export type ModelPrediction = InferModel<typeof modelPrediction>;
export type NewModelPrediction = InferModel<typeof modelPrediction, "insert">;
