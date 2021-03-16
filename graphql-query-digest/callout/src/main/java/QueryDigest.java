package com.apigee.graphql;

import java.lang.System;
import com.apigee.flow.execution.ExecutionContext;
import com.apigee.flow.execution.ExecutionResult;
import com.apigee.flow.execution.spi.Execution;
import com.apigee.flow.message.MessageContext;

import org.json.*;

import java.math.BigInteger; 

import java.io.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


import graphql.GraphQLError;
import graphql.InvalidSyntaxError;
import graphql.PublicApi;
import graphql.language.Definition;
import graphql.language.Document;
import graphql.language.SDLDefinition;
import graphql.parser.InvalidSyntaxException;
import graphql.parser.Parser;
import graphql.schema.idl.errors.SchemaProblem;


public class QueryDigest implements Execution {

  // stole from: https://stackoverflow.com/questions/2644847/how-to-generate-a-checksum-for-an-java-object
  private BigInteger checksum(Object obj) throws IOException, NoSuchAlgorithmException {

    if (obj == null) {
      return BigInteger.ZERO;   
    }

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(baos);
    oos.writeObject(obj);
    oos.close();

    MessageDigest m = MessageDigest.getInstance("SHA1");
    m.update(baos.toByteArray());

    return new BigInteger(1, m.digest());
  }

  public ExecutionResult execute(MessageContext mCtx, ExecutionContext executionContext) {
		
    try {
      String payload = mCtx.getMessage().getContent();

      JSONObject o = new JSONObject(payload.toString());

      if (o.has("query")) {
        Parser parser = new Parser();
        Document document = parser.parseDocument( o.getString("query"));
        //mCtx.setVariable("message.header.x-gql-ast", document.toString());
        mCtx.setVariable("apigee.GraphQL.queryHash", checksum(document));
      }

      //mCtx.setVariable("message.header.x-gql-origheader", payload.toString());
            
      return ExecutionResult.SUCCESS;
    } catch (Exception e) {
      mCtx.setVariable("message.header.x-error", e.toString());
      return ExecutionResult.ABORT;
    }
  }
}
