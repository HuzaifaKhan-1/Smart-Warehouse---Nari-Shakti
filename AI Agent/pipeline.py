from ml_engine import predict_batch
from ai_agent import ai_decision_from_ml


def analyze_batch(temp, humidity, days, produce):

    # Step 1: ML prediction
    risk, remaining = predict_batch(temp, humidity, days, produce)

    # Step 2: AI decision
    decision = ai_decision_from_ml(risk, remaining, produce)

    # Combine everything
    final_output = {
        "produce": produce,
        "spoilage_risk": risk,
        "remaining_days": remaining,
        **decision
    }

    return final_output


# Test locally
if __name__ == "__main__":
    result = analyze_batch(32, 82, 10, "Tomato")
    print(result)