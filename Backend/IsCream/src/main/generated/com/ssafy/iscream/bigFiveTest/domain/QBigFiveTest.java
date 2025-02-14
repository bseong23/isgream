package com.ssafy.iscream.bigFiveTest.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBigFiveTest is a Querydsl query type for BigFiveTest
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBigFiveTest extends EntityPathBase<BigFiveTest> {

    private static final long serialVersionUID = 582234849L;

    public static final QBigFiveTest bigFiveTest = new QBigFiveTest("bigFiveTest");

    public final NumberPath<Double> agreeableness = createNumber("agreeableness", Double.class);

    public final NumberPath<Integer> childId = createNumber("childId", Integer.class);

    public final NumberPath<Double> conscientiousness = createNumber("conscientiousness", Double.class);

    public final StringPath date = createString("date");

    public final NumberPath<Double> emotionalStability = createNumber("emotionalStability", Double.class);

    public final NumberPath<Double> extraversion = createNumber("extraversion", Double.class);

    public final NumberPath<Double> openness = createNumber("openness", Double.class);

    public final StringPath pdfUrl = createString("pdfUrl");

    public final NumberPath<Integer> testId = createNumber("testId", Integer.class);

    public QBigFiveTest(String variable) {
        super(BigFiveTest.class, forVariable(variable));
    }

    public QBigFiveTest(Path<? extends BigFiveTest> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBigFiveTest(PathMetadata metadata) {
        super(BigFiveTest.class, metadata);
    }

}

