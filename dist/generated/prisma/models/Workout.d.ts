import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Workout
 *
 */
export type WorkoutModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkoutPayload>;
export type AggregateWorkout = {
    _count: WorkoutCountAggregateOutputType | null;
    _avg: WorkoutAvgAggregateOutputType | null;
    _sum: WorkoutSumAggregateOutputType | null;
    _min: WorkoutMinAggregateOutputType | null;
    _max: WorkoutMaxAggregateOutputType | null;
};
export type WorkoutAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
};
export type WorkoutSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
};
export type WorkoutMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    startTime: Date | null;
    endTime: Date | null;
    isFinished: boolean | null;
    createdAt: Date | null;
};
export type WorkoutMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    startTime: Date | null;
    endTime: Date | null;
    isFinished: boolean | null;
    createdAt: Date | null;
};
export type WorkoutCountAggregateOutputType = {
    id: number;
    userId: number;
    startTime: number;
    endTime: number;
    isFinished: number;
    createdAt: number;
    _all: number;
};
export type WorkoutAvgAggregateInputType = {
    id?: true;
    userId?: true;
};
export type WorkoutSumAggregateInputType = {
    id?: true;
    userId?: true;
};
export type WorkoutMinAggregateInputType = {
    id?: true;
    userId?: true;
    startTime?: true;
    endTime?: true;
    isFinished?: true;
    createdAt?: true;
};
export type WorkoutMaxAggregateInputType = {
    id?: true;
    userId?: true;
    startTime?: true;
    endTime?: true;
    isFinished?: true;
    createdAt?: true;
};
export type WorkoutCountAggregateInputType = {
    id?: true;
    userId?: true;
    startTime?: true;
    endTime?: true;
    isFinished?: true;
    createdAt?: true;
    _all?: true;
};
export type WorkoutAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Workout to aggregate.
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Workouts to fetch.
     */
    orderBy?: Prisma.WorkoutOrderByWithRelationInput | Prisma.WorkoutOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.WorkoutWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Workouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Workouts
    **/
    _count?: true | WorkoutCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: WorkoutAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: WorkoutSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: WorkoutMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: WorkoutMaxAggregateInputType;
};
export type GetWorkoutAggregateType<T extends WorkoutAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkout]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkout[P]> : Prisma.GetScalarType<T[P], AggregateWorkout[P]>;
};
export type WorkoutGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutWhereInput;
    orderBy?: Prisma.WorkoutOrderByWithAggregationInput | Prisma.WorkoutOrderByWithAggregationInput[];
    by: Prisma.WorkoutScalarFieldEnum[] | Prisma.WorkoutScalarFieldEnum;
    having?: Prisma.WorkoutScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkoutCountAggregateInputType | true;
    _avg?: WorkoutAvgAggregateInputType;
    _sum?: WorkoutSumAggregateInputType;
    _min?: WorkoutMinAggregateInputType;
    _max?: WorkoutMaxAggregateInputType;
};
export type WorkoutGroupByOutputType = {
    id: number;
    userId: number;
    startTime: Date | null;
    endTime: Date | null;
    isFinished: boolean;
    createdAt: Date;
    _count: WorkoutCountAggregateOutputType | null;
    _avg: WorkoutAvgAggregateOutputType | null;
    _sum: WorkoutSumAggregateOutputType | null;
    _min: WorkoutMinAggregateOutputType | null;
    _max: WorkoutMaxAggregateOutputType | null;
};
type GetWorkoutGroupByPayload<T extends WorkoutGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkoutGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkoutGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkoutGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkoutGroupByOutputType[P]>;
}>>;
export type WorkoutWhereInput = {
    AND?: Prisma.WorkoutWhereInput | Prisma.WorkoutWhereInput[];
    OR?: Prisma.WorkoutWhereInput[];
    NOT?: Prisma.WorkoutWhereInput | Prisma.WorkoutWhereInput[];
    id?: Prisma.IntFilter<"Workout"> | number;
    userId?: Prisma.IntFilter<"Workout"> | number;
    startTime?: Prisma.DateTimeNullableFilter<"Workout"> | Date | string | null;
    endTime?: Prisma.DateTimeNullableFilter<"Workout"> | Date | string | null;
    isFinished?: Prisma.BoolFilter<"Workout"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Workout"> | Date | string;
    exercises?: Prisma.ExerciseListRelationFilter;
};
export type WorkoutOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    startTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    endTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    isFinished?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    exercises?: Prisma.ExerciseOrderByRelationAggregateInput;
};
export type WorkoutWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.WorkoutWhereInput | Prisma.WorkoutWhereInput[];
    OR?: Prisma.WorkoutWhereInput[];
    NOT?: Prisma.WorkoutWhereInput | Prisma.WorkoutWhereInput[];
    userId?: Prisma.IntFilter<"Workout"> | number;
    startTime?: Prisma.DateTimeNullableFilter<"Workout"> | Date | string | null;
    endTime?: Prisma.DateTimeNullableFilter<"Workout"> | Date | string | null;
    isFinished?: Prisma.BoolFilter<"Workout"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Workout"> | Date | string;
    exercises?: Prisma.ExerciseListRelationFilter;
}, "id">;
export type WorkoutOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    startTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    endTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    isFinished?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WorkoutCountOrderByAggregateInput;
    _avg?: Prisma.WorkoutAvgOrderByAggregateInput;
    _max?: Prisma.WorkoutMaxOrderByAggregateInput;
    _min?: Prisma.WorkoutMinOrderByAggregateInput;
    _sum?: Prisma.WorkoutSumOrderByAggregateInput;
};
export type WorkoutScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkoutScalarWhereWithAggregatesInput | Prisma.WorkoutScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkoutScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkoutScalarWhereWithAggregatesInput | Prisma.WorkoutScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Workout"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"Workout"> | number;
    startTime?: Prisma.DateTimeNullableWithAggregatesFilter<"Workout"> | Date | string | null;
    endTime?: Prisma.DateTimeNullableWithAggregatesFilter<"Workout"> | Date | string | null;
    isFinished?: Prisma.BoolWithAggregatesFilter<"Workout"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Workout"> | Date | string;
};
export type WorkoutCreateInput = {
    userId: number;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    isFinished?: boolean;
    createdAt?: Date | string;
    exercises?: Prisma.ExerciseCreateNestedManyWithoutWorkoutInput;
};
export type WorkoutUncheckedCreateInput = {
    id?: number;
    userId: number;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    isFinished?: boolean;
    createdAt?: Date | string;
    exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutWorkoutInput;
};
export type WorkoutUpdateInput = {
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exercises?: Prisma.ExerciseUpdateManyWithoutWorkoutNestedInput;
};
export type WorkoutUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutWorkoutNestedInput;
};
export type WorkoutCreateManyInput = {
    id?: number;
    userId: number;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    isFinished?: boolean;
    createdAt?: Date | string;
};
export type WorkoutUpdateManyMutationInput = {
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    isFinished?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkoutAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type WorkoutMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    isFinished?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkoutMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    isFinished?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkoutSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type WorkoutScalarRelationFilter = {
    is?: Prisma.WorkoutWhereInput;
    isNot?: Prisma.WorkoutWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type WorkoutCreateNestedOneWithoutExercisesInput = {
    create?: Prisma.XOR<Prisma.WorkoutCreateWithoutExercisesInput, Prisma.WorkoutUncheckedCreateWithoutExercisesInput>;
    connectOrCreate?: Prisma.WorkoutCreateOrConnectWithoutExercisesInput;
    connect?: Prisma.WorkoutWhereUniqueInput;
};
export type WorkoutUpdateOneRequiredWithoutExercisesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkoutCreateWithoutExercisesInput, Prisma.WorkoutUncheckedCreateWithoutExercisesInput>;
    connectOrCreate?: Prisma.WorkoutCreateOrConnectWithoutExercisesInput;
    upsert?: Prisma.WorkoutUpsertWithoutExercisesInput;
    connect?: Prisma.WorkoutWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkoutUpdateToOneWithWhereWithoutExercisesInput, Prisma.WorkoutUpdateWithoutExercisesInput>, Prisma.WorkoutUncheckedUpdateWithoutExercisesInput>;
};
export type WorkoutCreateWithoutExercisesInput = {
    userId: number;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    isFinished?: boolean;
    createdAt?: Date | string;
};
export type WorkoutUncheckedCreateWithoutExercisesInput = {
    id?: number;
    userId: number;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    isFinished?: boolean;
    createdAt?: Date | string;
};
export type WorkoutCreateOrConnectWithoutExercisesInput = {
    where: Prisma.WorkoutWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkoutCreateWithoutExercisesInput, Prisma.WorkoutUncheckedCreateWithoutExercisesInput>;
};
export type WorkoutUpsertWithoutExercisesInput = {
    update: Prisma.XOR<Prisma.WorkoutUpdateWithoutExercisesInput, Prisma.WorkoutUncheckedUpdateWithoutExercisesInput>;
    create: Prisma.XOR<Prisma.WorkoutCreateWithoutExercisesInput, Prisma.WorkoutUncheckedCreateWithoutExercisesInput>;
    where?: Prisma.WorkoutWhereInput;
};
export type WorkoutUpdateToOneWithWhereWithoutExercisesInput = {
    where?: Prisma.WorkoutWhereInput;
    data: Prisma.XOR<Prisma.WorkoutUpdateWithoutExercisesInput, Prisma.WorkoutUncheckedUpdateWithoutExercisesInput>;
};
export type WorkoutUpdateWithoutExercisesInput = {
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutUncheckedUpdateWithoutExercisesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    startTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isFinished?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type WorkoutCountOutputType
 */
export type WorkoutCountOutputType = {
    exercises: number;
};
export type WorkoutCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    exercises?: boolean | WorkoutCountOutputTypeCountExercisesArgs;
};
/**
 * WorkoutCountOutputType without action
 */
export type WorkoutCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutCountOutputType
     */
    select?: Prisma.WorkoutCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * WorkoutCountOutputType without action
 */
export type WorkoutCountOutputTypeCountExercisesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExerciseWhereInput;
};
export type WorkoutSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    isFinished?: boolean;
    createdAt?: boolean;
    exercises?: boolean | Prisma.Workout$exercisesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkoutCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workout"]>;
export type WorkoutSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    isFinished?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["workout"]>;
export type WorkoutSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    isFinished?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["workout"]>;
export type WorkoutSelectScalar = {
    id?: boolean;
    userId?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    isFinished?: boolean;
    createdAt?: boolean;
};
export type WorkoutOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "startTime" | "endTime" | "isFinished" | "createdAt", ExtArgs["result"]["workout"]>;
export type WorkoutInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    exercises?: boolean | Prisma.Workout$exercisesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkoutCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WorkoutIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type WorkoutIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $WorkoutPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Workout";
    objects: {
        exercises: Prisma.$ExercisePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        startTime: Date | null;
        endTime: Date | null;
        isFinished: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["workout"]>;
    composites: {};
};
export type WorkoutGetPayload<S extends boolean | null | undefined | WorkoutDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkoutPayload, S>;
export type WorkoutCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkoutFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkoutCountAggregateInputType | true;
};
export interface WorkoutDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Workout'];
        meta: {
            name: 'Workout';
        };
    };
    /**
     * Find zero or one Workout that matches the filter.
     * @param {WorkoutFindUniqueArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkoutFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkoutFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Workout that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkoutFindUniqueOrThrowArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkoutFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkoutFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Workout that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindFirstArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkoutFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkoutFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Workout that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindFirstOrThrowArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkoutFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkoutFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Workouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workouts
     * const workouts = await prisma.workout.findMany()
     *
     * // Get first 10 Workouts
     * const workouts = await prisma.workout.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const workoutWithIdOnly = await prisma.workout.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WorkoutFindManyArgs>(args?: Prisma.SelectSubset<T, WorkoutFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Workout.
     * @param {WorkoutCreateArgs} args - Arguments to create a Workout.
     * @example
     * // Create one Workout
     * const Workout = await prisma.workout.create({
     *   data: {
     *     // ... data to create a Workout
     *   }
     * })
     *
     */
    create<T extends WorkoutCreateArgs>(args: Prisma.SelectSubset<T, WorkoutCreateArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Workouts.
     * @param {WorkoutCreateManyArgs} args - Arguments to create many Workouts.
     * @example
     * // Create many Workouts
     * const workout = await prisma.workout.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WorkoutCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkoutCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Workouts and returns the data saved in the database.
     * @param {WorkoutCreateManyAndReturnArgs} args - Arguments to create many Workouts.
     * @example
     * // Create many Workouts
     * const workout = await prisma.workout.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Workouts and only return the `id`
     * const workoutWithIdOnly = await prisma.workout.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WorkoutCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkoutCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Workout.
     * @param {WorkoutDeleteArgs} args - Arguments to delete one Workout.
     * @example
     * // Delete one Workout
     * const Workout = await prisma.workout.delete({
     *   where: {
     *     // ... filter to delete one Workout
     *   }
     * })
     *
     */
    delete<T extends WorkoutDeleteArgs>(args: Prisma.SelectSubset<T, WorkoutDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Workout.
     * @param {WorkoutUpdateArgs} args - Arguments to update one Workout.
     * @example
     * // Update one Workout
     * const workout = await prisma.workout.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WorkoutUpdateArgs>(args: Prisma.SelectSubset<T, WorkoutUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Workouts.
     * @param {WorkoutDeleteManyArgs} args - Arguments to filter Workouts to delete.
     * @example
     * // Delete a few Workouts
     * const { count } = await prisma.workout.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WorkoutDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkoutDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Workouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workouts
     * const workout = await prisma.workout.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WorkoutUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkoutUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Workouts and returns the data updated in the database.
     * @param {WorkoutUpdateManyAndReturnArgs} args - Arguments to update many Workouts.
     * @example
     * // Update many Workouts
     * const workout = await prisma.workout.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Workouts and only return the `id`
     * const workoutWithIdOnly = await prisma.workout.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends WorkoutUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkoutUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Workout.
     * @param {WorkoutUpsertArgs} args - Arguments to update or create a Workout.
     * @example
     * // Update or create a Workout
     * const workout = await prisma.workout.upsert({
     *   create: {
     *     // ... data to create a Workout
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workout we want to update
     *   }
     * })
     */
    upsert<T extends WorkoutUpsertArgs>(args: Prisma.SelectSubset<T, WorkoutUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkoutClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Workouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutCountArgs} args - Arguments to filter Workouts to count.
     * @example
     * // Count the number of Workouts
     * const count = await prisma.workout.count({
     *   where: {
     *     // ... the filter for the Workouts we want to count
     *   }
     * })
    **/
    count<T extends WorkoutCountArgs>(args?: Prisma.Subset<T, WorkoutCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkoutCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Workout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkoutAggregateArgs>(args: Prisma.Subset<T, WorkoutAggregateArgs>): Prisma.PrismaPromise<GetWorkoutAggregateType<T>>;
    /**
     * Group by Workout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends WorkoutGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkoutGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkoutGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkoutGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkoutGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Workout model
     */
    readonly fields: WorkoutFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Workout.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__WorkoutClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    exercises<T extends Prisma.Workout$exercisesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workout$exercisesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Workout model
 */
export interface WorkoutFieldRefs {
    readonly id: Prisma.FieldRef<"Workout", 'Int'>;
    readonly userId: Prisma.FieldRef<"Workout", 'Int'>;
    readonly startTime: Prisma.FieldRef<"Workout", 'DateTime'>;
    readonly endTime: Prisma.FieldRef<"Workout", 'DateTime'>;
    readonly isFinished: Prisma.FieldRef<"Workout", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Workout", 'DateTime'>;
}
/**
 * Workout findUnique
 */
export type WorkoutFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter, which Workout to fetch.
     */
    where: Prisma.WorkoutWhereUniqueInput;
};
/**
 * Workout findUniqueOrThrow
 */
export type WorkoutFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter, which Workout to fetch.
     */
    where: Prisma.WorkoutWhereUniqueInput;
};
/**
 * Workout findFirst
 */
export type WorkoutFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter, which Workout to fetch.
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Workouts to fetch.
     */
    orderBy?: Prisma.WorkoutOrderByWithRelationInput | Prisma.WorkoutOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Workouts.
     */
    cursor?: Prisma.WorkoutWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Workouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Workouts.
     */
    distinct?: Prisma.WorkoutScalarFieldEnum | Prisma.WorkoutScalarFieldEnum[];
};
/**
 * Workout findFirstOrThrow
 */
export type WorkoutFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter, which Workout to fetch.
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Workouts to fetch.
     */
    orderBy?: Prisma.WorkoutOrderByWithRelationInput | Prisma.WorkoutOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Workouts.
     */
    cursor?: Prisma.WorkoutWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Workouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Workouts.
     */
    distinct?: Prisma.WorkoutScalarFieldEnum | Prisma.WorkoutScalarFieldEnum[];
};
/**
 * Workout findMany
 */
export type WorkoutFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter, which Workouts to fetch.
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Workouts to fetch.
     */
    orderBy?: Prisma.WorkoutOrderByWithRelationInput | Prisma.WorkoutOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Workouts.
     */
    cursor?: Prisma.WorkoutWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Workouts.
     */
    skip?: number;
    distinct?: Prisma.WorkoutScalarFieldEnum | Prisma.WorkoutScalarFieldEnum[];
};
/**
 * Workout create
 */
export type WorkoutCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * The data needed to create a Workout.
     */
    data: Prisma.XOR<Prisma.WorkoutCreateInput, Prisma.WorkoutUncheckedCreateInput>;
};
/**
 * Workout createMany
 */
export type WorkoutCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workouts.
     */
    data: Prisma.WorkoutCreateManyInput | Prisma.WorkoutCreateManyInput[];
};
/**
 * Workout createManyAndReturn
 */
export type WorkoutCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * The data used to create many Workouts.
     */
    data: Prisma.WorkoutCreateManyInput | Prisma.WorkoutCreateManyInput[];
};
/**
 * Workout update
 */
export type WorkoutUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * The data needed to update a Workout.
     */
    data: Prisma.XOR<Prisma.WorkoutUpdateInput, Prisma.WorkoutUncheckedUpdateInput>;
    /**
     * Choose, which Workout to update.
     */
    where: Prisma.WorkoutWhereUniqueInput;
};
/**
 * Workout updateMany
 */
export type WorkoutUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Workouts.
     */
    data: Prisma.XOR<Prisma.WorkoutUpdateManyMutationInput, Prisma.WorkoutUncheckedUpdateManyInput>;
    /**
     * Filter which Workouts to update
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * Limit how many Workouts to update.
     */
    limit?: number;
};
/**
 * Workout updateManyAndReturn
 */
export type WorkoutUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * The data used to update Workouts.
     */
    data: Prisma.XOR<Prisma.WorkoutUpdateManyMutationInput, Prisma.WorkoutUncheckedUpdateManyInput>;
    /**
     * Filter which Workouts to update
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * Limit how many Workouts to update.
     */
    limit?: number;
};
/**
 * Workout upsert
 */
export type WorkoutUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * The filter to search for the Workout to update in case it exists.
     */
    where: Prisma.WorkoutWhereUniqueInput;
    /**
     * In case the Workout found by the `where` argument doesn't exist, create a new Workout with this data.
     */
    create: Prisma.XOR<Prisma.WorkoutCreateInput, Prisma.WorkoutUncheckedCreateInput>;
    /**
     * In case the Workout was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.WorkoutUpdateInput, Prisma.WorkoutUncheckedUpdateInput>;
};
/**
 * Workout delete
 */
export type WorkoutDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
    /**
     * Filter which Workout to delete.
     */
    where: Prisma.WorkoutWhereUniqueInput;
};
/**
 * Workout deleteMany
 */
export type WorkoutDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Workouts to delete
     */
    where?: Prisma.WorkoutWhereInput;
    /**
     * Limit how many Workouts to delete.
     */
    limit?: number;
};
/**
 * Workout.exercises
 */
export type Workout$exercisesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: Prisma.ExerciseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Exercise
     */
    omit?: Prisma.ExerciseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ExerciseInclude<ExtArgs> | null;
    where?: Prisma.ExerciseWhereInput;
    orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[];
    cursor?: Prisma.ExerciseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExerciseScalarFieldEnum | Prisma.ExerciseScalarFieldEnum[];
};
/**
 * Workout without action
 */
export type WorkoutDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: Prisma.WorkoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Workout
     */
    omit?: Prisma.WorkoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WorkoutInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Workout.d.ts.map